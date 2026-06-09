/**
 * 车辆配置自动补全脚本（通用版）
 * 从「全部车型数据.xlsx」按品牌+车系+年份自动匹配配置，写入海外站数据库
 *
 * 匹配策略:
 *   1. 品牌精确匹配（中文品牌名）
 *   2. 车系精确匹配（忽略空格和大小写）
 *   3. 年份最接近优先
 *   4. 同年份中选配置最全的
 *
 * 用法: npx tsx scripts/auto-enrich-specs.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

// ===== 类型定义 =====

interface ExcelRow {
  brand: string;
  series: string;
  fullName: string;
  manufacturer: string;
  productionMethod: string;
  launchDate: string;
  energyType: string;
  engineModel: string;
  intakeType: string;
  displacement: number;
  cylinderArrangement: string;
  cylinderCount: number;
  valvesPerCylinder: number;
  valveTrain: string;
  maxHorsepower: number;
  maxPowerKw: number;
  maxTorqueNm: number;
  maxPowerRpm: string;
  maxTorqueRpm: string;
  engineTech: string;
  fuelGrade: string;
  fuelSupply: string;
  cylinderHeadMaterial: string;
  cylinderBlockMaterial: string;
  transmissionType: string;
  transmissionDesc: string;
  gearCount: number;
  bodyStyle: string;
  doorCount: number;
  seatCount: number;
  wheelbase: number;
  length: number;
  width: number;
  height: number;
  groundClearance: number;
  fuelTankCapacity: number;
  trunkCapacity: number;
  curbWeight: number;
  driveType: string;
  frontSuspension: string;
  rearSuspension: string;
  frontBrake: string;
  rearBrake: string;
  steeringAssist: string;
  bodyStructure: string;
  parkingBrake: string;
  frontTireSpec: string;
  rearTireSpec: string;
  spareTireSpec: string;
  warranty: string;
  combinedFuelConsumption: number;
  // 安全配置
  driverAirbag: string;
  passengerAirbag: string;
  frontSideAirbag: string;
  rearSideAirbag: string;
  frontHeadAirbag: string;
  rearHeadAirbag: string;
  tpms: string;
  seatbeltWarning: string;
  abs: string;
  ebd: string;
  brakeAssist: string;
  tractionControl: string;
  esc: string;
  blindSpot: string;
  laneDeparture: string;
  activeBraking: string;
  cruiseControl: string;
  adaptiveCruise: string;
  frontRadar: string;
  rearRadar: string;
  reverseCamera: string;
  panoramicCamera: string;
  hillAssist: string;
  autoHold: string;
  hillDescent: string;
  // 外部配置
  sunroof: string;
  panoramicSunroof: string;
  alloyWheels: string;
  engineImmobilizer: string;
  centralLocking: string;
  remoteKey: string;
  keylessStart: string;
  keylessEntry: string;
  // 内部配置
  multiFunctionSteering: string;
  paddleShift: string;
  steeringHeating: string;
  tripComputer: string;
  fullLCDDashboard: string;
  hud: string;
  seatMaterial: string;
  driverSeatElectric: string;
  passengerSeatElectric: string;
  frontSeatHeating: string;
  rearSeatHeating: string;
  seatVentilation: string;
  seatMassage: string;
  rearCupHolder: string;
  // 多媒体
  gps: string;
  centerScreen: string;
  bluetooth: string;
  auxInput: string;
  cdDvd: string;
  speakerCount: string;
  // 灯光
  lowBeamType: string;
  highBeamType: string;
  drl: string;
  autoHeadlight: string;
  corneringLight: string;
  frontFogLight: string;
  headlightHeightAdjust: string;
  headlightWasher: string;
  // 玻璃/后视镜
  powerWindows: string;
  windowAntiPinch: string;
  mirrorElectric: string;
  mirrorHeating: string;
  mirrorFolding: string;
  mirrorMemory: string;
  rearSunshade: string;
  rearSideSunshade: string;
  rainSensor: string;
  // 空调
  autoAC: string;
  rearACVents: string;
  tempZoneControl: string;
  airPurifier: string;
}

// ===== 工具函数 =====

function cleanNumber(val: any): number {
  if (val === null || val === undefined || val === '') return 0;
  const s = String(val).trim();
  if (s === '-' || s === '无' || s === '') return 0;
  const match = s.match(/^(\d+\.?\d*)/);
  if (match) return Number(match[1]);
  if (s.includes('●')) return 1;
  return 0;
}

function cleanString(val: any): string {
  if (val === null || val === undefined) return '';
  const s = String(val).trim();
  return s.replace(/:●/g, '').replace(/●/g, '').trim();
}

function parseRow(row: any[]): ExcelRow | null {
  if (!row || !row[0]) return null;
  return {
    brand: String(row[0] || '').trim(),
    series: String(row[1] || '').trim(),
    fullName: String(row[2] || '').trim(),
    manufacturer: String(row[3] || '').trim(),
    productionMethod: String(row[4] || '').trim(),
    launchDate: String(row[5] || '').trim(),
    energyType: String(row[6] || '').trim(),
    engineModel: String(row[7] || '').trim(),
    intakeType: String(row[8] || '').trim(),
    displacement: cleanNumber(row[9]),
    cylinderArrangement: String(row[10] || '').trim(),
    cylinderCount: cleanNumber(row[11]),
    valvesPerCylinder: cleanNumber(row[12]),
    valveTrain: String(row[13] || '').trim(),
    maxHorsepower: cleanNumber(row[14]),
    maxPowerKw: cleanNumber(row[15]),
    maxPowerRpm: String(row[16] || '').trim(),
    maxTorqueNm: cleanNumber(row[17]),
    maxTorqueRpm: String(row[18] || '').trim(),
    engineTech: String(row[19] || '').trim(),
    fuelGrade: String(row[20] || '').trim(),
    fuelSupply: String(row[21] || '').trim(),
    cylinderHeadMaterial: String(row[22] || '').trim(),
    cylinderBlockMaterial: String(row[23] || '').trim(),
    transmissionType: cleanString(row[24]),
    transmissionDesc: cleanString(row[25]),
    gearCount: cleanNumber(row[26]),
    bodyStyle: cleanString(row[27]),
    doorCount: cleanNumber(row[28]),
    seatCount: cleanNumber(row[29]),
    wheelbase: cleanNumber(row[30]),
    length: cleanNumber(row[31]),
    width: cleanNumber(row[32]),
    height: cleanNumber(row[33]),
    groundClearance: cleanNumber(row[34]),
    fuelTankCapacity: cleanNumber(row[35]),
    trunkCapacity: cleanNumber(row[36]),
    curbWeight: cleanNumber(row[37]),
    driveType: cleanString(row[38]),
    frontSuspension: cleanString(row[39]),
    rearSuspension: cleanString(row[40]),
    frontBrake: cleanString(row[41]),
    rearBrake: cleanString(row[42]),
    steeringAssist: cleanString(row[43]),
    bodyStructure: cleanString(row[44]),
    parkingBrake: cleanString(row[45]),
    frontTireSpec: cleanString(row[46]),
    rearTireSpec: cleanString(row[47]),
    spareTireSpec: cleanString(row[48]),
    warranty: cleanString(row[49]),
    combinedFuelConsumption: cleanNumber(row[50]),
    driverAirbag: cleanString(row[51]),
    passengerAirbag: cleanString(row[52]),
    frontSideAirbag: cleanString(row[53]),
    rearSideAirbag: cleanString(row[54]),
    frontHeadAirbag: cleanString(row[55]),
    rearHeadAirbag: cleanString(row[56]),
    tpms: cleanString(row[57]),
    seatbeltWarning: cleanString(row[58]),
    abs: cleanString(row[59]),
    ebd: cleanString(row[60]),
    brakeAssist: cleanString(row[61]),
    tractionControl: cleanString(row[62]),
    esc: cleanString(row[63]),
    blindSpot: cleanString(row[64]),
    laneDeparture: cleanString(row[65]),
    activeBraking: cleanString(row[66]),
    cruiseControl: cleanString(row[67]),
    adaptiveCruise: cleanString(row[68]),
    frontRadar: cleanString(row[69]),
    rearRadar: cleanString(row[70]),
    reverseCamera: cleanString(row[71]),
    panoramicCamera: cleanString(row[72]),
    hillAssist: cleanString(row[73]),
    autoHold: cleanString(row[74]),
    hillDescent: cleanString(row[75]),
    sunroof: cleanString(row[76]),
    panoramicSunroof: cleanString(row[77]),
    alloyWheels: cleanString(row[78]),
    engineImmobilizer: cleanString(row[79]),
    centralLocking: cleanString(row[80]),
    remoteKey: cleanString(row[81]),
    keylessStart: cleanString(row[82]),
    keylessEntry: cleanString(row[83]),
    multiFunctionSteering: cleanString(row[84]),
    paddleShift: cleanString(row[85]),
    steeringHeating: cleanString(row[86]),
    tripComputer: cleanString(row[87]),
    fullLCDDashboard: cleanString(row[88]),
    hud: cleanString(row[89]),
    seatMaterial: cleanString(row[90]),
    driverSeatElectric: cleanString(row[91]),
    passengerSeatElectric: cleanString(row[92]),
    frontSeatHeating: cleanString(row[93]),
    rearSeatHeating: cleanString(row[94]),
    seatVentilation: cleanString(row[95]),
    seatMassage: cleanString(row[96]),
    rearCupHolder: cleanString(row[97]),
    gps: cleanString(row[98]),
    centerScreen: cleanString(row[99]),
    bluetooth: cleanString(row[100]),
    auxInput: cleanString(row[101]),
    cdDvd: cleanString(row[102]),
    speakerCount: cleanString(row[103]),
    lowBeamType: cleanString(row[104]),
    highBeamType: cleanString(row[105]),
    drl: cleanString(row[106]),
    autoHeadlight: cleanString(row[107]),
    corneringLight: cleanString(row[108]),
    frontFogLight: cleanString(row[109]),
    headlightHeightAdjust: cleanString(row[110]),
    headlightWasher: cleanString(row[111]),
    powerWindows: cleanString(row[112]),
    windowAntiPinch: cleanString(row[113]),
    mirrorElectric: cleanString(row[114]),
    mirrorHeating: cleanString(row[115]),
    mirrorFolding: cleanString(row[116]),
    mirrorMemory: cleanString(row[117]),
    rearSunshade: cleanString(row[118]),
    rearSideSunshade: cleanString(row[119]),
    rainSensor: cleanString(row[120]),
    autoAC: cleanString(row[121]),
    rearACVents: cleanString(row[122]),
    tempZoneControl: cleanString(row[123]),
    airPurifier: cleanString(row[124]),
  };
}

// ===== 匹配逻辑 =====

/**
 * 通用匹配：品牌 + 车系 + 年份
 * 不依赖硬编码映射，直接按中文名匹配
 */
function matchVehicle(brand: string, model: string, year: number, allRows: ExcelRow[]): ExcelRow | null {
  const b = brand.trim();
  const m = model.trim();

  // Step 1: 品牌匹配（精确或包含）
  let candidates = allRows.filter(r => {
    const rb = r.brand;
    return rb === b || rb.includes(b) || b.includes(rb);
  });

  if (candidates.length === 0) {
    // 品牌模糊匹配：取前两个字
    const bShort = b.slice(0, 2);
    candidates = allRows.filter(r => r.brand.startsWith(bShort));
  }

  if (candidates.length === 0) return null;

  // Step 2: 车系匹配
  // 从 model 中提取车系关键词（去掉品牌前缀）
  const modelClean = m.replace(new RegExp(`^${b}\\s*`, 'i'), '').trim();
  const modelKeywords = [modelClean, m].filter(k => k.length > 0);

  let seriesMatch: ExcelRow[] = [];
  for (const kw of modelKeywords) {
    const kwLower = kw.toLowerCase().replace(/\s+/g, '');
    seriesMatch = candidates.filter(r => {
      const rs = (r.series + ' ' + r.fullName).toLowerCase().replace(/\s+/g, '');
      return rs.includes(kwLower) || kwLower.includes(rs.slice(0, kwLower.length));
    });
    if (seriesMatch.length > 0) break;
  }

  if (seriesMatch.length > 0) {
    candidates = seriesMatch;
  }

  if (candidates.length === 0) return null;

  // Step 3: 过滤掉空数据行
  const validCandidates = candidates.filter(r =>
    r.displacement > 0 || r.maxPowerKw > 0 || r.seatCount > 0 || r.maxHorsepower > 0
  );
  if (validCandidates.length > 0) candidates = validCandidates;

  // Step 4: 按年份接近度排序
  const withYearScore = candidates.map(r => {
    const launchYear = parseInt(r.launchDate?.slice(0, 4)) || 0;
    const yearDiff = launchYear > 0 ? Math.abs(launchYear - year) : 99;
    // 配置完整度评分
    const completenessScore =
      (r.displacement > 0 ? 1 : 0) +
      (r.maxPowerKw > 0 ? 1 : 0) +
      (r.seatCount > 0 ? 1 : 0) +
      (r.maxHorsepower > 0 ? 1 : 0) +
      (r.driveType ? 1 : 0) +
      (r.transmissionType ? 1 : 0);
    return { row: r, yearDiff, completenessScore };
  });

  // 排序：年份差最小优先，同年份配置最全优先
  withYearScore.sort((a, b) => {
    if (a.yearDiff !== b.yearDiff) return a.yearDiff - b.yearDiff;
    return b.completenessScore - a.completenessScore;
  });

  return withYearScore[0]?.row || null;
}

// ===== 功能构建 =====

function buildFeatures(spec: ExcelRow): Record<string, string[]> {
  const features: Record<string, string[]> = {};

  const addIf = (category: string, label: string, val: string | undefined) => {
    if (val && val !== '-' && val !== '无' && val !== '') {
      if (!features[category]) features[category] = [];
      features[category].push(label);
    }
  };

  // 安全配置
  addIf('安全配置', '主驾安全气囊', spec.driverAirbag);
  addIf('安全配置', '副驾安全气囊', spec.passengerAirbag);
  addIf('安全配置', '前排侧气囊', spec.frontSideAirbag);
  addIf('安全配置', '后排侧气囊', spec.rearSideAirbag);
  addIf('安全配置', '前排头部气囊', spec.frontHeadAirbag);
  addIf('安全配置', '后排头部气囊', spec.rearHeadAirbag);
  addIf('安全配置', '胎压监测', spec.tpms);
  addIf('安全配置', 'ABS防抱死', spec.abs);
  addIf('安全配置', 'EBD制动力分配', spec.ebd);
  addIf('安全配置', '刹车辅助', spec.brakeAssist);
  addIf('安全配置', '牵引力控制', spec.tractionControl);
  addIf('安全配置', '车身稳定控制', spec.esc);
  addIf('安全配置', '并线辅助', spec.blindSpot);
  addIf('安全配置', '车道偏离预警', spec.laneDeparture);
  addIf('安全配置', '主动刹车', spec.activeBraking);

  // 辅助操控
  addIf('辅助操控', '前雷达', spec.frontRadar);
  addIf('辅助操控', '后雷达', spec.rearRadar);
  addIf('辅助操控', '倒车影像', spec.reverseCamera);
  addIf('辅助操控', '360°全景影像', spec.panoramicCamera);
  addIf('辅助操控', '定速巡航', spec.cruiseControl);
  addIf('辅助操控', '自适应巡航', spec.adaptiveCruise);
  addIf('辅助操控', '上坡辅助', spec.hillAssist);
  addIf('辅助操控', '自动驻车', spec.autoHold);
  addIf('辅助操控', '陡坡缓降', spec.hillDescent);

  // 外部配置
  addIf('外部配置', '电动天窗', spec.sunroof);
  addIf('外部配置', '全景天窗', spec.panoramicSunroof);
  addIf('外部配置', '铝合金轮毂', spec.alloyWheels);

  // 内部配置
  if (spec.seatMaterial && spec.seatMaterial !== '-' && spec.seatMaterial !== '无')
    addIf('内部配置', `座椅材质:${spec.seatMaterial}`, spec.seatMaterial);
  addIf('内部配置', '主驾电动调节', spec.driverSeatElectric);
  addIf('内部配置', '副驾电动调节', spec.passengerSeatElectric);
  addIf('内部配置', '前排座椅加热', spec.frontSeatHeating);
  addIf('内部配置', '后排座椅加热', spec.rearSeatHeating);
  addIf('内部配置', '座椅通风', spec.seatVentilation);
  addIf('内部配置', '座椅按摩', spec.seatMassage);
  addIf('内部配置', '多功能方向盘', spec.multiFunctionSteering);
  addIf('内部配置', '方向盘换挡', spec.paddleShift);
  addIf('内部配置', '方向盘加热', spec.steeringHeating);
  addIf('内部配置', '全液晶仪表盘', spec.fullLCDDashboard);
  addIf('内部配置', 'HUD抬头显示', spec.hud);

  // 多媒体
  addIf('多媒体', 'GPS导航', spec.gps);
  addIf('多媒体', '中控大屏', spec.centerScreen);
  addIf('多媒体', '蓝牙/车载电话', spec.bluetooth);
  if (spec.speakerCount && spec.speakerCount !== '-' && spec.speakerCount !== '无')
    addIf('多媒体', `扬声器:${spec.speakerCount}`, spec.speakerCount);

  // 灯光
  if (spec.lowBeamType && spec.lowBeamType !== '-' && spec.lowBeamType !== '无')
    addIf('灯光', `���光:${spec.lowBeamType}`, spec.lowBeamType);
  if (spec.highBeamType && spec.highBeamType !== '-' && spec.highBeamType !== '无')
    addIf('灯光', `远光:${spec.highBeamType}`, spec.highBeamType);
  addIf('灯光', '日间行车灯', spec.drl);
  addIf('灯光', '自动头灯', spec.autoHeadlight);
  addIf('灯光', '前雾灯', spec.frontFogLight);

  // 空调
  addIf('空调', '自动空调', spec.autoAC);
  addIf('空调', '后座出风口', spec.rearACVents);
  addIf('空调', '温度分区控制', spec.tempZoneControl);
  addIf('空调', '空气净化', spec.airPurifier);

  return features;
}

function mapFuelType(energyType: string): string | null {
  if (!energyType || energyType === '-') return null;
  const map: Record<string, string> = {
    '汽油': 'PETROL',
    '柴油': 'DIESEL',
    '纯电动': 'ELECTRIC',
    '插电式混合动力': 'PLUGIN_HYBRID',
    '油电混合': 'HYBRID',
    '增程式': 'ELECTRIC',
    '氢燃料电池': 'HYBRID',
    '天然气': 'CNG',
  };
  for (const [key, val] of Object.entries(map)) {
    if (energyType.includes(key)) return val;
  }
  return null;
}

function mapTransmission(transType: string, transDesc: string, gearCount: number, energyType: string): string | null {
  if (energyType && (energyType.includes('纯电动') || energyType.includes('电动'))) {
    return 'Single-speed (EV)';
  }
  if (!transType || transType === '-' || transType === '变速箱') return null;
  let result = transType;
  if (transDesc && transDesc !== '-' && transDesc !== '变速箱') result = transDesc;
  if (gearCount > 0) result = `${gearCount}速${result}`;
  return result;
}

function mapBodyStyle(bodyStyle: string): string | null {
  if (!bodyStyle || bodyStyle === '-') return null;
  const map: Record<string, string> = {
    '三厢车': 'SEDAN',
    '两厢车': 'HATCHBACK',
    'SUV': 'SUV',
    'MPV': 'MPV',
    '旅行车': 'WAGON',
    '跑车': 'COUPE',
    '皮卡': 'PICKUP',
    '客车': 'BUS',
    '货车': 'TRUCK',
  };
  for (const [key, val] of Object.entries(map)) {
    if (bodyStyle.includes(key)) return val;
  }
  return bodyStyle;
}

// ===== 主流程 =====

async function main() {
  console.log('📂 读取Excel数据...');
  const wb = XLSX.readFile('/Users/mj/Desktop/全部车型数据.xlsx');
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rawData: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

  // 跳过表头
  const allRows: ExcelRow[] = [];
  for (let i = 1; i < rawData.length; i++) {
    const row = parseRow(rawData[i]);
    if (row) allRows.push(row);
  }
  console.log(`✅ 读取 ${allRows.length} 条车型数据`);

  // 获取数据库中已上架的车辆
  const vehicles = await prisma.vehicle.findMany({
    where: { status: 'available', published: true },
    orderBy: [{ brand: 'asc' }, { model: 'asc' }],
  });
  console.log(`🚗 数据库中有 ${vehicles.length} 辆已上架车辆\n`);

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const vehicle of vehicles) {
    console.log(`\n--- ${vehicle.brand} ${vehicle.model} (${vehicle.year}) ---`);

    // 检查是否已有完整配置
    if (vehicle.specsJson && vehicle.specsJson !== '{}' && vehicle.displacement && vehicle.fuelType) {
      console.log('  ⏭️  已有完整配置，跳过');
      skipped++;
      continue;
    }

    const spec = matchVehicle(vehicle.brand, vehicle.model, vehicle.year, allRows);

    if (!spec) {
      console.log(`  ❌ Excel中未找到匹配车型`);
      notFound++;
      continue;
    }

    console.log(`  ✅ 匹配到: ${spec.fullName}`);
    console.log(`     排量: ${spec.displacement}L | 变速箱: ${spec.transmissionType} | 座位: ${spec.seatCount}`);
    console.log(`     马力: ${spec.maxHorsepower}Ps | 功率: ${spec.maxPowerKw}kW | 驱动: ${spec.driveType}`);
    console.log(`     尺寸: ${spec.length}x${spec.width}x${spec.height}mm | 轴距: ${spec.wheelbase}mm`);

    const features = buildFeatures(spec);
    const fuelType = mapFuelType(spec.energyType);
    const transmission = mapTransmission(spec.transmissionType, spec.transmissionDesc, spec.gearCount, spec.energyType);
    const bodyStyle = mapBodyStyle(spec.bodyStyle);

    // 构建更新数据
    const updateData: any = {
      fuelType: fuelType || undefined,
      displacement: spec.displacement > 0 ? spec.displacement : undefined,
      transmission: transmission || undefined,
      seatCount: spec.seatCount > 0 ? spec.seatCount : undefined,
      bodyStyle: bodyStyle || undefined,
      vehicleLengthM: spec.length > 0 ? spec.length / 1000 : undefined,
      motorPowerKw: spec.maxPowerKw > 0 ? spec.maxPowerKw : undefined,
      specsJson: JSON.stringify({
        fullName: spec.fullName,
        manufacturer: spec.manufacturer,
        productionMethod: spec.productionMethod,
        energyType: spec.energyType,
        engineModel: spec.engineModel,
        intakeType: spec.intakeType,
        displacement: spec.displacement,
        maxHorsepower: spec.maxHorsepower,
        maxPowerKw: spec.maxPowerKw,
        maxTorqueNm: spec.maxTorqueNm,
        transmissionType: spec.transmissionType,
        transmissionDesc: spec.transmissionDesc,
        gearCount: spec.gearCount,
        bodyStyle: spec.bodyStyle,
        doorCount: spec.doorCount,
        seatCount: spec.seatCount,
        wheelbase: spec.wheelbase,
        length: spec.length,
        width: spec.width,
        height: spec.height,
        curbWeight: spec.curbWeight,
        driveType: spec.driveType,
        fuelConsumption: spec.combinedFuelConsumption,
        fuelGrade: spec.fuelGrade,
        fuelTankCapacity: spec.fuelTankCapacity,
        frontSuspension: spec.frontSuspension,
        rearSuspension: spec.rearSuspension,
        frontBrake: spec.frontBrake,
        rearBrake: spec.rearBrake,
        steeringAssist: spec.steeringAssist,
        bodyStructure: spec.bodyStructure,
        frontTireSpec: spec.frontTireSpec,
        rearTireSpec: spec.rearTireSpec,
        warranty: spec.warranty,
        features,
      }),
      description: [
        `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
        spec.energyType && spec.energyType !== '-' ? spec.energyType : '',
        spec.displacement > 0 ? `${spec.displacement}L` : '',
        spec.maxHorsepower > 0 ? `${spec.maxHorsepower}Ps` : '',
        spec.maxPowerKw > 0 ? `${spec.maxPowerKw}kW` : '',
        spec.driveType || '',
        spec.seatCount > 0 ? `${spec.seatCount}座` : '',
      ].filter(Boolean).join(', '),
    };

    // 更新数据库
    await prisma.vehicle.update({
      where: { id: vehicle.id },
      data: updateData,
    });

    console.log(`  💾 已写入数据库`);
    updated++;
  }

  console.log(`\n\n📊 ========== 完成 ==========`);
  console.log(`   ✅ 更新: ${updated} 辆`);
  console.log(`   ⏭️  跳过: ${skipped} 辆`);
  console.log(`   ❌ 未找到: ${notFound} 辆`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ 错误:', e);
    prisma.$disconnect();
    process.exit(1);
  });

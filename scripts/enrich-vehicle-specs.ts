/**
 * 车辆配置自动补全脚本
 * 从「全部车型数据.xlsx」匹配配置，写入海外站数据库
 */
import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as path from 'path';

const prisma = new PrismaClient();

// 品牌名映射：数据库英文名 → Excel中文名
const BRAND_MAP: Record<string, string> = {
  'BYD': '比亚迪',
  'Honda': '本田',
  'Toyota': '丰田',
  'Hyundai': '现代',
  'Tesla': '特斯拉',
};

// 车型名映射：数据库model → Excel车系关键词
const MODEL_KEYWORDS: Record<string, string[]> = {
  'Han': ['汉'],
  'CR-V': ['CR-V', 'CRV'],
  'CBR500R': ['CBR500R', 'CBR500'],
  'Tucson': ['Tucson', '途胜', 'ix35'],
  'Model Y': ['Model Y', 'ModelY'],
  'Corolla': ['Corolla', '卡罗拉', '花冠'],
  'Hilux': ['Hilux', '海拉克斯'],
  'RAV4': ['RAV4', 'RAV 4', 'RAV4荣放'],
  '320D': [],
  'Genuine Parts': [],
};

// 需要搜索的车型（Excel中找不到的）
const NEEDS_SEARCH = ['Caterpillar 320D', 'Honda CBR500R', 'Toyota Genuine Parts'];

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
  maxPowerRpm: string;
  maxTorqueNm: number;
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

// 清理带符号的数值字段（如 "5:●" → 5, "●" → 1）
function cleanNumber(val: any): number {
  if (val === null || val === undefined || val === '') return 0;
  const s = String(val).trim();
  if (s === '-' || s === '无' || s === '') return 0;
  // 提取数字部分
  const match = s.match(/^(\d+\.?\d*)/);
  if (match) return Number(match[1]);
  // 如果只有 ● 表示有此配置
  if (s.includes('●')) return 1;
  return 0;
}

// 清理带符号的字符串字段（如 "前置前驱:●" → "前置前驱"）
function cleanString(val: any): string {
  if (val === null || val === undefined) return '';
  const s = String(val).trim();
  // 去掉 :● 后缀
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

// 从车款名称中提取座位数（如"5座"）
function extractSeatCount(fullName: string): number {
  const match = fullName.match(/(\d+)座/);
  return match ? parseInt(match[1]) : 0;
}

// 从车款名称中提取车门数
function extractDoorCount(fullName: string): number {
  const match = fullName.match(/(\d+)门/);
  return match ? parseInt(match[1]) : 0;
}

function matchVehicle(brandEn: string, model: string, year: number, rows: ExcelRow[]): ExcelRow | null {
  const brandCn = BRAND_MAP[brandEn];
  if (!brandCn) return null;

  const keywords = MODEL_KEYWORDS[model];
  if (!keywords || keywords.length === 0) return null;

  // 筛选同品牌同车系同年份的车型
  let candidates = rows.filter(r => {
    if (r.brand !== brandCn) return false;
    const seriesAndName = (r.series + ' ' + r.fullName).toLowerCase();
    const matchKw = keywords.some(kw => seriesAndName.includes(kw.toLowerCase()));
    if (!matchKw) return false;
    // 年份匹配：fullName中包含年份
    const yearStr = String(year);
    return r.fullName.includes(yearStr) || r.launchDate.startsWith(yearStr);
  });

  if (candidates.length === 0) {
    // 放宽年份限制
    candidates = rows.filter(r => {
      if (r.brand !== brandCn) return false;
      const seriesAndName = (r.series + ' ' + r.fullName).toLowerCase();
      return keywords.some(kw => seriesAndName.includes(kw.toLowerCase()));
    });
  }

  if (candidates.length === 0) return null;

  // 过滤掉空数据行（排量、功率、座位数全为0的）
  candidates = candidates.filter(r => r.displacement > 0 || r.maxPowerKw > 0 || r.seatCount > 0 || r.maxHorsepower > 0);
  if (candidates.length === 0) return null;

  // 优先选年份最接近的
  candidates.sort((a, b) => {
    const yearA = parseInt(a.launchDate) || 0;
    const yearB = parseInt(b.launchDate) || 0;
    return Math.abs(yearB - year) - Math.abs(yearA - year);
  });

  // 如果有多个同年份的，选配置最全的（排量不为0的）
  const best = candidates.sort((a, b) => {
    const scoreA = (a.displacement > 0 ? 1 : 0) + (a.maxPowerKw > 0 ? 1 : 0) + (a.seatCount > 0 ? 1 : 0);
    const scoreB = (b.displacement > 0 ? 1 : 0) + (b.maxPowerKw > 0 ? 1 : 0) + (b.seatCount > 0 ? 1 : 0);
    return scoreB - scoreA;
  })[0];

  // 如果座位数为0，尝试从车款名称提取
  if (best.seatCount === 0) {
    best.seatCount = extractSeatCount(best.fullName);
  }
  if (best.doorCount === 0) {
    best.doorCount = extractDoorCount(best.fullName);
  }

  return best;
}

function buildFeatures(spec: ExcelRow): Record<string, any> {
  const features: Record<string, any> = {};

  // 安全配置
  const safety: string[] = [];
  if (spec.driverAirbag && spec.driverAirbag !== '-' && spec.driverAirbag !== '无') safety.push('主驾安全气囊');
  if (spec.passengerAirbag && spec.passengerAirbag !== '-' && spec.passengerAirbag !== '无') safety.push('副驾安全气囊');
  if (spec.frontSideAirbag && spec.frontSideAirbag !== '-' && spec.frontSideAirbag !== '无') safety.push('前排侧气囊');
  if (spec.rearSideAirbag && spec.rearSideAirbag !== '-' && spec.rearSideAirbag !== '无') safety.push('后排侧气囊');
  if (spec.frontHeadAirbag && spec.frontHeadAirbag !== '-' && spec.frontHeadAirbag !== '无') safety.push('前排头部气囊');
  if (spec.rearHeadAirbag && spec.rearHeadAirbag !== '-' && spec.rearHeadAirbag !== '无') safety.push('后排头部气囊');
  if (spec.tpms && spec.tpms !== '-' && spec.tpms !== '无') safety.push('胎压监测');
  if (spec.abs && spec.abs !== '-' && spec.abs !== '无') safety.push('ABS');
  if (spec.ebd && spec.ebd !== '-' && spec.ebd !== '无') safety.push('EBD');
  if (spec.brakeAssist && spec.brakeAssist !== '-' && spec.brakeAssist !== '无') safety.push('刹车辅助');
  if (spec.tractionControl && spec.tractionControl !== '-' && spec.tractionControl !== '无') safety.push('牵引力控制');
  if (spec.esc && spec.esc !== '-' && spec.esc !== '无') safety.push('车身稳定控制');
  if (spec.blindSpot && spec.blindSpot !== '-' && spec.blindSpot !== '无') safety.push('并线辅助');
  if (spec.laneDeparture && spec.laneDeparture !== '-' && spec.laneDeparture !== '无') safety.push('车道偏离预警');
  if (spec.activeBraking && spec.activeBraking !== '-' && spec.activeBraking !== '无') safety.push('主动刹车');
  if (safety.length > 0) features['安全配置'] = safety;

  // 辅助/操控
  const assist: string[] = [];
  if (spec.frontRadar && spec.frontRadar !== '-' && spec.frontRadar !== '无') assist.push('前雷达');
  if (spec.rearRadar && spec.rearRadar !== '-' && spec.rearRadar !== '无') assist.push('后雷达');
  if (spec.reverseCamera && spec.reverseCamera !== '-' && spec.reverseCamera !== '无') assist.push('倒车影像');
  if (spec.panoramicCamera && spec.panoramicCamera !== '-' && spec.panoramicCamera !== '无') assist.push('360°全景影像');
  if (spec.cruiseControl && spec.cruiseControl !== '-' && spec.cruiseControl !== '无') assist.push('定速巡航');
  if (spec.adaptiveCruise && spec.adaptiveCruise !== '-' && spec.adaptiveCruise !== '无') assist.push('自适应巡航');
  if (spec.hillAssist && spec.hillAssist !== '-' && spec.hillAssist !== '无') assist.push('上坡辅助');
  if (spec.autoHold && spec.autoHold !== '-' && spec.autoHold !== '无') assist.push('自动驻车');
  if (spec.hillDescent && spec.hillDescent !== '-' && spec.hillDescent !== '无') assist.push('陡坡缓降');
  if (assist.length > 0) features['辅助操控'] = assist;

  // 外部配置
  const exterior: string[] = [];
  if (spec.sunroof && spec.sunroof !== '-' && spec.sunroof !== '无') exterior.push('电动天窗');
  if (spec.panoramicSunroof && spec.panoramicSunroof !== '-' && spec.panoramicSunroof !== '无') exterior.push('全景天窗');
  if (spec.alloyWheels && spec.alloyWheels !== '-' && spec.alloyWheels !== '无') exterior.push('铝合金轮毂');
  if (exterior.length > 0) features['外部配置'] = exterior;

  // 内部配置
  const interior: string[] = [];
  if (spec.seatMaterial && spec.seatMaterial !== '-' && spec.seatMaterial !== '无') interior.push(`座椅材质:${spec.seatMaterial}`);
  if (spec.driverSeatElectric && spec.driverSeatElectric !== '-' && spec.driverSeatElectric !== '无') interior.push('主驾电动调节');
  if (spec.passengerSeatElectric && spec.passengerSeatElectric !== '-' && spec.passengerSeatElectric !== '无') interior.push('副驾电动调节');
  if (spec.frontSeatHeating && spec.frontSeatHeating !== '-' && spec.frontSeatHeating !== '无') interior.push('前排座椅加热');
  if (spec.rearSeatHeating && spec.rearSeatHeating !== '-' && spec.rearSeatHeating !== '无') interior.push('后排座椅加热');
  if (spec.seatVentilation && spec.seatVentilation !== '-' && spec.seatVentilation !== '无') interior.push('座椅通风');
  if (spec.seatMassage && spec.seatMassage !== '-' && spec.seatMassage !== '无') interior.push('座椅按摩');
  if (spec.multiFunctionSteering && spec.multiFunctionSteering !== '-' && spec.multiFunctionSteering !== '无') interior.push('多功能方向盘');
  if (spec.paddleShift && spec.paddleShift !== '-' && spec.paddleShift !== '无') interior.push('方向盘换挡');
  if (spec.steeringHeating && spec.steeringHeating !== '-' && spec.steeringHeating !== '无') interior.push('方向盘加热');
  if (spec.fullLCDDashboard && spec.fullLCDDashboard !== '-' && spec.fullLCDDashboard !== '无') interior.push('全液晶仪表盘');
  if (spec.hud && spec.hud !== '-' && spec.hud !== '无') interior.push('HUD抬头显示');
  if (interior.length > 0) features['内部配置'] = interior;

  // 多媒体
  const media: string[] = [];
  if (spec.gps && spec.gps !== '-' && spec.gps !== '无') media.push('GPS导航');
  if (spec.centerScreen && spec.centerScreen !== '-' && spec.centerScreen !== '无') media.push('中控大屏');
  if (spec.bluetooth && spec.bluetooth !== '-' && spec.bluetooth !== '无') media.push('蓝牙/车载电话');
  if (spec.speakerCount && spec.speakerCount !== '-' && spec.speakerCount !== '无') media.push(`扬声器:${spec.speakerCount}`);
  if (media.length > 0) features['多媒体'] = media;

  // 灯光
  const lights: string[] = [];
  if (spec.lowBeamType && spec.lowBeamType !== '-' && spec.lowBeamType !== '无') lights.push(`近光:${spec.lowBeamType}`);
  if (spec.highBeamType && spec.highBeamType !== '-' && spec.highBeamType !== '无') lights.push(`远光:${spec.highBeamType}`);
  if (spec.drl && spec.drl !== '-' && spec.drl !== '无') lights.push('日间行车灯');
  if (spec.autoHeadlight && spec.autoHeadlight !== '-' && spec.autoHeadlight !== '无') lights.push('自动头灯');
  if (spec.frontFogLight && spec.frontFogLight !== '-' && spec.frontFogLight !== '无') lights.push('前雾灯');
  if (lights.length > 0) features['灯光'] = lights;

  // 空调
  const ac: string[] = [];
  if (spec.autoAC && spec.autoAC !== '-' && spec.autoAC !== '无') ac.push('自动空调');
  if (spec.rearACVents && spec.rearACVents !== '-' && spec.rearACVents !== '无') ac.push('后座出风口');
  if (spec.tempZoneControl && spec.tempZoneControl !== '-' && spec.tempZoneControl !== '无') ac.push('温度分区控制');
  if (spec.airPurifier && spec.airPurifier !== '-' && spec.airPurifier !== '无') ac.push('空气净化');
  if (ac.length > 0) features['空调'] = ac;

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
  // 电动车没有传统变速箱
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

  // 获取数据库中的车辆
  const vehicles = await prisma.vehicle.findMany({
    where: { status: 'available', published: true },
    orderBy: [{ brand: 'asc' }, { model: 'asc' }],
  });
  console.log(`🚗 数据库中有 ${vehicles.length} 辆车待处理\n`);

  let updated = 0;
  let skipped = 0;

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

    // 如果座位数仍为0，尝试从车款名称提取
    let finalSeatCount = spec.seatCount;
    if (finalSeatCount === 0) {
      finalSeatCount = extractSeatCount(spec.fullName);
    }
    // 如果车门数仍为0，尝试从车款名称提取
    let finalDoorCount = spec.doorCount;
    if (finalDoorCount === 0) {
      finalDoorCount = extractDoorCount(spec.fullName);
    }

    // 构建更新数据
    const updateData: any = {
      fuelType: fuelType || undefined,
      displacement: spec.displacement > 0 ? spec.displacement : undefined,
      transmission: transmission || undefined,
      seatCount: finalSeatCount > 0 ? finalSeatCount : undefined,
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
        doorCount: finalDoorCount,
        seatCount: finalSeatCount,
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
      description: `${vehicle.brand} ${vehicle.model} ${vehicle.year}, ${spec.energyType}, ${spec.displacement > 0 ? spec.displacement + 'L ' : ''}${spec.maxHorsepower > 0 ? spec.maxHorsepower + 'Ps, ' : ''}${spec.maxPowerKw > 0 ? spec.maxPowerKw + 'kW, ' : ''}${spec.driveType || ''}${spec.seatCount > 0 ? spec.seatCount + ' seats' : ''}`.replace(/\s+/g, ' ').replace(/,\s*$/, '').trim(),
    };

    // 更新数据库
    await prisma.vehicle.update({
      where: { id: vehicle.id },
      data: updateData,
    });

    console.log(`  💾 已写入数据库`);
    updated++;
  }

  console.log(`\n\n📊 完成: 更新 ${updated} 辆, 跳过 ${skipped} 辆`);
  console.log(`⚠️  以下车型需要手动搜索补充配置:`);
  for (const name of NEEDS_SEARCH) {
    console.log(`   - ${name}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ 错误:', e);
    prisma.$disconnect();
    process.exit(1);
  });

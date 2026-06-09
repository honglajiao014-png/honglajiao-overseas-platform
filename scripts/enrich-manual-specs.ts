/**
 * 手动补充Excel中找不到的车型配置
 * Caterpillar 320D, Honda CBR500R, Toyota Hilux, Toyota Genuine Parts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Caterpillar 320D - 挖掘机
  const cat320d = await prisma.vehicle.findFirst({ where: { slug: { contains: 'caterpillar-320d' } } });
  if (cat320d) {
    await prisma.vehicle.update({
      where: { id: cat320d.id },
      data: {
        fuelType: 'DIESEL',
        displacement: 6.4,
        motorPowerKw: 103,
        vehicleLengthM: 9.46,
        seatCount: 1,
        equipmentType: 'Excavator',
        engineModel: 'Cat C6.4 ACERT',
        specsJson: JSON.stringify({
          equipmentType: 'Excavator',
          engineModel: 'Cat C6.4 ACERT',
          enginePowerKw: 103,
          enginePowerHp: 138,
          displacement: 6.4,
          cylinders: 6,
          bore: '102mm',
          stroke: '130mm',
          operatingWeight: '20,300-21,500 kg',
          overallLength: '9,460 mm',
          overallWidth: '2,800 mm',
          overallHeight: '3,050 mm',
          trackLengthOnGround: '3,370 mm',
          trackGauge: '2,200 mm',
          tailSwingRadius: '2,750 mm',
          groundClearance: '470 mm',
          fuelTankCapacity: '410 L',
          bucketCapacity: '0.9-1.1 m³',
          maxDiggingDepth: '6,710 mm',
          maxReachAlongGround: '9,870 mm',
          features: {
            '类型': '中型液压挖掘机',
            '发动机': ['Cat C6.4 ACERT 柴油发动机', '6缸', '排量6.4L', '净功率103kW (138hp)'],
            '工作重量': '20,300-21,500 kg',
            '尺寸': '长9,460mm x 宽2,800mm x 高3,050mm',
          },
        }),
        description: 'Caterpillar 320D hydraulic excavator, Cat C6.4 ACERT engine, 103kW (138hp), 6.4L diesel, operating weight 20-21.5 tons, 0.9-1.1m³ bucket capacity.',
      },
    });
    console.log('✅ Caterpillar 320D 已更新');
  }

  // 2. Honda CBR500R - 摩托车
  const cbr500r = await prisma.vehicle.findFirst({ where: { slug: { contains: 'honda-cbr500r' } } });
  if (cbr500r) {
    await prisma.vehicle.update({
      where: { id: cbr500r.id },
      data: {
        fuelType: 'PETROL',
        displacement: 0.471,
        displacementCc: 471,
        motorPowerKw: 35,
        vehicleLengthM: 2.08,
        seatCount: 2,
        motorcycleType: 'Sport',
        transmission: '6-speed Manual',
        specsJson: JSON.stringify({
          motorcycleType: 'Sport',
          engineType: '471cc liquid-cooled parallel-twin DOHC 4-stroke',
          displacementCc: 471,
          displacement: 0.471,
          bore: '67.0mm',
          stroke: '66.8mm',
          compressionRatio: '10.7:1',
          maxPowerKw: 35,
          maxPowerHp: 47,
          maxPowerRpm: 8600,
          maxTorqueNm: 43,
          maxTorqueRpm: 6500,
          fuelSystem: 'PGM-FI electronic fuel injection',
          transmission: '6-speed manual',
          finalDrive: 'O-ring sealed chain',
          overallLength: '2,080 mm',
          overallWidth: '760 mm',
          overallHeight: '1,145 mm',
          wheelbase: '1,410 mm',
          seatHeight: '785 mm',
          groundClearance: '130 mm',
          curbWeight: '192 kg',
          fuelTankCapacity: '17.1 L',
          frontSuspension: '41mm Showa SFF-BP USD fork, 120mm travel',
          rearSuspension: 'Pro-Link monoshock, 5-stage preload adjuster, 119mm travel',
          frontBrake: '296mm dual discs with Nissin 2-piston calipers (ABS)',
          rearBrake: '240mm single disc (ABS)',
          frontTyre: '120/70ZR-17',
          rearTyre: '160/60ZR-17',
          features: {
            '仪表': '5英寸TFT彩色显示屏，Honda RoadSync互联',
            '灯光': '全LED照明，双LED头灯',
            '悬挂': '41mm Showa SFF-BP倒立前叉',
            '制动': '前双碟刹+ABS',
            '轮毂': '轻量化5辐铸铝轮毂',
            '驾照等级': 'A2驾照兼容 (35kW限制)',
          },
        }),
        description: 'Honda CBR500R 2023, 471cc liquid-cooled parallel-twin, 35kW (47hp), 6-speed manual, 192kg curb weight, ABS, full LED lighting, TFT display with Honda RoadSync.',
      },
    });
    console.log('✅ Honda CBR500R 已更新');
  }

  // 3. Toyota Hilux - 皮卡
  const hilux = await prisma.vehicle.findFirst({ where: { slug: { contains: 'toyota-hilux' } } });
  if (hilux) {
    await prisma.vehicle.update({
      where: { id: hilux.id },
      data: {
        fuelType: 'DIESEL',
        displacement: 2.8,
        motorPowerKw: 150,
        vehicleLengthM: 5.325,
        seatCount: 5,
        bodyStyle: 'PICKUP',
        transmission: '6-speed Automatic',
        specsJson: JSON.stringify({
          engineOptions: [
            { type: '2.8L Turbo Diesel (1GD-FTV)', displacement: 2.755, powerKw: 150, powerPs: 204, torqueNm: 500 },
            { type: '2.4L Turbo Diesel (2GD-FTV)', displacement: 2.393, powerKw: 110, powerPs: 150, torqueNm: 400 },
            { type: '2.7L Petrol (2TR-FE)', displacement: 2.694, powerKw: 122, powerPs: 166, torqueNm: 245 },
          ],
          selectedEngine: '2.8L Turbo Diesel (1GD-FTV)',
          displacement: 2.8,
          maxPowerKw: 150,
          maxPowerPs: 204,
          maxTorqueNm: 500,
          transmission: '6-speed Automatic',
          driveType: '4x4 (Part-time with low-range transfer case)',
          bodyStyle: 'PICKUP',
          doorCount: 4,
          seatCount: 5,
          overallLength: '5,325 mm',
          overallWidth: '1,855 mm',
          overallHeight: '1,820 mm',
          wheelbase: '3,085 mm',
          groundClearance: '227 mm',
          cargoBedLength: '1,525 mm',
          cargoBedWidth: '1,540 mm',
          cargoBedDepth: '480 mm',
          fuelTankCapacity: '80 L',
          fuelConsumption: '8.4 L/100km',
          towingCapacity: '3,500 kg (braked)',
          payloadCapacity: '~1,000 kg',
          frontSuspension: 'Double wishbone',
          rearSuspension: 'Leaf spring',
          turningRadius: '6.7 m',
          features: {
            '驱动': '分时四驱带低速分动箱',
            '牵引': '最大牵引3,500kg',
            '货箱': '1,525mm x 1,540mm x 480mm',
            '油箱': '80L',
            '离地间隙': '227mm',
          },
        }),
        description: 'Toyota Hilux 2023 Double Cab, 2.8L Turbo Diesel, 150kW (204Ps), 500Nm, 6-speed Automatic, 4x4, 5 seats, 3,500kg towing capacity.',
      },
    });
    console.log('✅ Toyota Hilux 已更新');
  }

  // 4. Toyota Genuine Parts - 汽车配件
  const parts = await prisma.vehicle.findFirst({ where: { slug: { contains: 'toyota-genuine-parts' } } });
  if (parts) {
    await prisma.vehicle.update({
      where: { id: parts.id },
      data: {
        type: 'Auto Parts',
        partCategory: 'Engine Parts',
        partCondition: 'NEW',
        compatibleModels: 'Toyota Hilux, Land Cruiser, Corolla, RAV4, Camry, Hiace',
        quantity: 100,
        specsJson: JSON.stringify({
          partCategory: 'Engine Parts',
          partCondition: 'NEW',
          brand: 'Toyota Genuine',
          compatibleModels: ['Hilux', 'Land Cruiser', 'Corolla', 'RAV4', 'Camry', 'Hiace'],
          partTypes: ['Engine bearings', 'Gaskets', 'Pistons', 'Valves', 'Timing belts', 'Oil filters', 'Fuel injectors'],
          features: {
            '品质': '丰田原厂正品配件',
            '适用车型': '丰田全系车型',
            '成色': '全新',
          },
        }),
        description: 'Genuine Toyota engine parts — bearings, gaskets, pistons, valves, timing belts, oil filters, fuel injectors. 100% authentic OEM parts compatible with Hilux, Land Cruiser, Corolla, RAV4, Camry, Hiace.',
      },
    });
    console.log('✅ Toyota Genuine Parts 已更新');
  }

  console.log('\n📊 手动补充完成');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ 错误:', e);
    prisma.$disconnect();
    process.exit(1);
  });

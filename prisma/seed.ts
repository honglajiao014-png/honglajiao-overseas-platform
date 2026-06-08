import { PrismaClient } from "@prisma/client";
// @ts-nocheck
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const vehicleSpecs = [
  // ===== 奥迪 =====
  {
    brand: "奥迪", model: "Q3", yearRange: "2021-2025",
    manufacturer: "一汽奥迪", vehicleType: "紧凑型SUV", releaseDate: "2021-09-30", energyType: "汽油",
    specs: {
      engine: { model: "EA211-DJS", intake: "涡轮增压", displacement: "1.4", layout: "L", cylinders: "4", valvesPerCylinder: "4", valveTrain: "DOHC", maxPowerKw: 110, maxPowerPs: 150, maxPowerRpm: "5000-6000", maxTorque: 250, maxTorqueRpm: "1750-3000", fuelGrade: "95号", fuelSupply: "直喷", headMaterial: "铝合金", blockMaterial: "铝合金" },
      transmission: { type: "湿式双离合变速箱(DCT)", description: "7挡湿式双离合", gears: 7 },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2680, length: 4495, width: 1848, height: 1616, fuelTank: 60, curbWeight: 1570 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式独立悬架", rearSuspension: "多连杆式独立悬架", frontBrake: "通风盘式", rearBrake: "盘式", steeringAssist: "电动助力", structure: "承载式", parkingBrake: "电子驻车", frontTire: "235/55 R18", rearTire: "235/55 R18", spareTire: "非全尺寸", warranty: "三年或10万公里", fuelEconomy: "7.08" },
      safety: { driverAirbag: true, frontSideAirbags: true, seatbeltReminder: "全车", abs: true, cruiseControl: "定速巡航", adaptiveCruise: "定速巡航", frontRadar: true, rearRadar: true, panoramicCamera: "360", hillAssist: true, autoHold: true },
      exterior: { sunroof: "可开启全景天窗", panoramicRoof: "可开启全景天窗", wheels: "铝合金", engineImmobilizer: true, centralLocking: true, remoteKey: "遥控钥匙" },
      interior: { multiFunctionSteering: true, gearShifter: "机械挡把换挡", steeringHeating: "可选", tripComputer: "彩色", fullLCDCluster: true },
      seats: { material: "皮/Alcantara混搭", frontHeating: "加热可选", rearCupHolder: true },
      media: { screen: "触控液晶屏", bluetooth: true, speakers: "10-11喇叭标配, ≥12喇叭可选" },
      lights: { daytimeRunning: true, autoHeadlights: true, headlightAdjustable: true, headlightWasher: "可选" },
      mirrors: { adjustment: "电动调节", heating: true, folding: "锁车自动折叠可选", autoDimming: "可选", memory: true },
      wipers: { rainSensing: "雨量感应式" },
      ac: { type: "自动空调", rearVents: true, zoneControl: true },
    }
  },
  {
    brand: "奥迪", model: "A4L", yearRange: "2016-2024",
    manufacturer: "一汽奥迪", vehicleType: "中型车", releaseDate: "2016-09-01", energyType: "汽油",
    specs: {
      engine: { model: "EA888", intake: "涡轮增压", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 140, maxPowerPs: 190, maxTorque: 320, fuelGrade: "95号", fuelSupply: "直喷" },
      transmission: { type: "湿式双离合变速箱(DCT)", description: "7挡湿式双离合", gears: 7 },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2908, length: 4858, width: 1847, height: 1439 },
      chassis: { drive: "前置前驱/前置四驱", frontSuspension: "五连杆独立悬架", rearSuspension: "五连杆独立悬架" },
      safety: { driverAirbag: true, abs: true, cruiseControl: "定速巡航", rearRadar: true },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金" },
      interior: { multiFunctionSteering: true, fullLCDCluster: true },
      seats: { material: "真皮", frontHeating: "加热可选" },
      media: { screen: "触控液晶屏", bluetooth: true, speakers: "10喇叭" },
      lights: { autoHeadlights: true, daytimeRunning: true },
      ac: { type: "自动空调", rearVents: true, zoneControl: true },
    }
  },
  {
    brand: "奥迪", model: "A6L", yearRange: "2018-2025",
    manufacturer: "一汽奥迪", vehicleType: "中大型车", releaseDate: "2018-01-01", energyType: "汽油",
    specs: {
      engine: { model: "EA888", intake: "涡轮增压", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 180, maxPowerPs: 245, maxTorque: 370, fuelGrade: "95号" },
      transmission: { type: "湿式双离合变速箱(DCT)", description: "7挡湿式双离合", gears: 7 },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 3024, length: 5038, width: 1886, height: 1475 },
      chassis: { drive: "前置前驱/前置四驱", frontSuspension: "五连杆独立悬架", rearSuspension: "五连杆独立悬架" },
      safety: { driverAirbag: true, frontSideAirbags: true, abs: true, cruiseControl: "定速巡航", panoramicCamera: "360" },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金" },
      interior: { multiFunctionSteering: true, fullLCDCluster: true },
      seats: { material: "真皮", heating: "前后排", massage: "可选" },
      media: { screen: "双触控液晶屏", bluetooth: true, speakers: "10喇叭" },
      lights: { matrixLed: true, autoHeadlights: true, adaptiveHighBeam: true },
      ac: { type: "四区自动空调", rearVents: true, zoneControl: true },
    }
  },

  // ===== 丰田 =====
  {
    brand: "丰田", model: "卡罗拉", yearRange: "2016-2024",
    manufacturer: "一汽丰田", vehicleType: "紧凑型车", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "1ZR-FE/9NR-FTS", intake: "自然吸气/涡轮增压", displacement: "1.2/1.6/1.8", layout: "L", cylinders: "4", maxPowerKw: 85, maxTorque: 185, fuelGrade: "92号", fuelSupply: "多点电喷" },
      transmission: { type: "CVT无级变速(模拟10挡)", description: "CVT", gears: 10 },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2700, length: 4635, width: 1780, height: 1455, fuelEconomy: "5.6" },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式独立悬架", rearSuspension: "多连杆独立悬架(E型)" },
      safety: { driverAirbag: true, abs: true, brakeAssist: true, tractionControl: true, stabilityControl: true, laneKeeping: "可选", adaptiveCruise: "可选", autonomousBraking: "可选" },
      exterior: { sunroof: "电动天窗可选", wheels: "铝合金" },
      interior: { multiFunctionSteering: true, tripComputer: "彩色" },
      seats: { material: "织物/真皮可选" },
      media: { screen: "触控液晶屏", bluetooth: true, speakers: "6喇叭" },
      lights: { autoHeadlights: "可选", daytimeRunning: "可选", ledHeadlights: "可选" },
      ac: { type: "自动空调可选", rearVents: "可选" },
    }
  },
  {
    brand: "丰田", model: "凯美瑞", yearRange: "2017-2025",
    manufacturer: "广汽丰田", vehicleType: "中型车", releaseDate: "2017-11-01", energyType: "汽油/混动",
    specs: {
      engine: { model: "A25A/A25B", intake: "自然吸气", displacement: "2.0/2.5", layout: "L", cylinders: "4", maxPowerKw: 131, maxTorque: 210, fuelGrade: "92号", fuelSupply: "混合喷射" },
      transmission: { type: "CVT无级变速/8AT", description: "Direct Shift-CVT/8速手自一体", gears: "8/10" },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2825, length: 4885, width: 1840, height: 1455 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式独立悬架", rearSuspension: "双叉臂式独立悬架" },
      safety: { driverAirbag: true, abs: true, cruiseControl: "自适应巡航", laneKeeping: true, autonomousBraking: true },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金" },
      interior: { multiFunctionSteering: true, fullLCDCluster: "可选", hud: "可选" },
      seats: { material: "真皮", heating: "前排可选", ventilation: "前排可选" },
      media: { screen: "触控液晶屏 9/12.3寸", bluetooth: true, speakers: "6/JBL 9喇叭" },
      lights: { ledHeadlights: true, autoHeadlights: true, adaptiveHighBeam: true },
      ac: { type: "自动空调", rearVents: true, zoneControl: true },
    }
  },
  {
    brand: "丰田", model: "RAV4荣放", yearRange: "2016-2025",
    manufacturer: "一汽丰田", vehicleType: "紧凑型SUV", releaseDate: "2016-01-01", energyType: "汽油/混动",
    specs: {
      engine: { model: "M20A/A25A", intake: "自然吸气", displacement: "2.0/2.5", layout: "L", cylinders: "4", maxPowerKw: 126, maxTorque: 209, fuelGrade: "92号" },
      transmission: { type: "CVT无级变速", description: "Direct Shift-CVT", gears: 10 },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2690, length: 4600, width: 1855, height: 1680 },
      chassis: { drive: "前置前驱/前置四驱", frontSuspension: "麦弗逊式", rearSuspension: "双叉臂式" },
      safety: { driverAirbag: true, abs: true, cruiseControl: "自适应巡航", laneKeeping: true, autonomousBraking: true },
      exterior: { sunroof: "可开启全景天窗可选", wheels: "铝合金", roofRails: true },
      interior: { multiFunctionSteering: true },
      seats: { material: "织物/真皮可选", heating: "前排可选" },
      media: { screen: "触控液晶屏", bluetooth: true },
      lights: { ledHeadlights: "可选", autoHeadlights: "可选" },
      ac: { type: "自动空调", rearVents: true },
    }
  },

  // ===== 五菱 =====
  {
    brand: "五菱", model: "宏光S3", yearRange: "2017-2023",
    manufacturer: "上汽通用五菱", vehicleType: "紧凑型SUV/MPV", releaseDate: "2017-11-01", energyType: "汽油",
    specs: {
      engine: { model: "L2B/LAR", intake: "自然吸气", displacement: "1.5", layout: "L", cylinders: "4", maxPowerKw: 73, maxPowerPs: 99, maxTorque: 140, fuelGrade: "92号", fuelSupply: "多点电喷" },
      transmission: { type: "手动变速箱(MT)", description: "6挡手动", gears: 6 },
      body: { form: "MPV/SUV", doors: 5, seats: 7, wheelbase: 2800, length: 4655, width: 1735, height: 1790, fuelTank: 50 },
      chassis: { drive: "前置后驱", frontSuspension: "麦弗逊式独立悬架", rearSuspension: "螺旋弹簧非独立悬架", frontBrake: "通风盘式", rearBrake: "鼓式", steeringAssist: "电动助力", structure: "承载式" },
      safety: { driverAirbag: true, abs: true, seatbeltReminder: "前排" },
      exterior: { wheels: "钢/铝合金可选", centralLocking: true, remoteKey: "遥控钥匙" },
      interior: { multiFunctionSteering: "可选", tripComputer: "单色" },
      seats: { material: "织物", seatConfig: "2+2+3" },
      media: { screen: "触控液晶屏可选", bluetooth: "可选", speakers: "2-4喇叭" },
      lights: { headlightAdjustable: true },
      ac: { type: "手动空调", rearVents: "独立后排出风口可选" },
    }
  },
  {
    brand: "五菱", model: "宏光MINIEV", yearRange: "2020-2025",
    manufacturer: "上汽通用五菱", vehicleType: "微型车", releaseDate: "2020-07-01", energyType: "纯电动",
    specs: {
      engine: { type: "纯电动", motorPower: 20, motorTorque: 85, batteryCapacity: "9.3/13.8kWh", range: "120/170km" },
      transmission: { type: "固定齿比变速箱", description: "单速", gears: 1 },
      body: { form: "微型两厢车", doors: 3, seats: 4, wheelbase: 1940, length: 2917, width: 1493, height: 1621, curbWeight: 665 },
      chassis: { drive: "后置后驱", frontSuspension: "麦弗逊式独立悬架", rearSuspension: "多连杆非独立悬架" },
      safety: { driverAirbag: "可选", abs: true, rearRadar: "可选" },
      exterior: { wheels: "钢", remoteKey: "遥控钥匙" },
      interior: { tripComputer: "单色", fullLCDCluster: "可选" },
      seats: { material: "织物" },
      media: { screen: "可选", bluetooth: "可选", speakers: "1-2喇叭" },
      ac: { type: "手动空调/暖风" },
    }
  },

  // ===== 比亚迪 =====
  {
    brand: "比亚迪", model: "宋Pro", yearRange: "2019-2025",
    manufacturer: "比亚迪", vehicleType: "紧凑型SUV", releaseDate: "2019-07-01", energyType: "汽油/混动/纯电",
    specs: {
      engine: { model: "BYD476ZQA", intake: "涡轮增压", displacement: "1.5", layout: "L", cylinders: "4", maxPowerKw: 118, maxTorque: 245, fuelGrade: "92号" },
      transmission: { type: "双离合变速箱(DCT)", description: "6挡湿式双离合", gears: 6 },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2712, length: 4650, width: 1860, height: 1700 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式" },
      safety: { driverAirbag: true, abs: true, cruiseControl: "定速巡航", rearRadar: true },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金" },
      interior: { multiFunctionSteering: true, fullLCDCluster: true, rotatingScreen: true },
      seats: { material: "仿皮", heating: "前排可选" },
      media: { screen: "旋转触控液晶屏 10.1/12.8寸", bluetooth: true, speakers: "6/Dynaudio可选" },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true },
      ac: { type: "自动空调", rearVents: true, pm25Filter: true },
    }
  },
  {
    brand: "比亚迪", model: "汉", yearRange: "2020-2025",
    manufacturer: "比亚迪", vehicleType: "中大型车", releaseDate: "2020-07-01", energyType: "纯电动/混动",
    specs: {
      engine: { type: "纯电动/插电混动", motorPower: 163, motorTorque: 330, batteryCapacity: "76.9kWh", range: "605km", acceleration: "3.9s(0-100)" },
      transmission: { type: "固定齿比变速箱", description: "单速", gears: 1 },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2920, length: 4980, width: 1910, height: 1495 },
      chassis: { drive: "前置前驱/双电机四驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式" },
      safety: { driverAirbag: true, abs: true, cruiseControl: "全速自适应巡航", laneKeeping: true, autonomousBraking: true, panoramicCamera: "360" },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金 19寸", hiddenDoorHandles: true },
      interior: { multiFunctionSteering: true, fullLCDCluster: true, hud: true, rotatingScreen: true },
      seats: { material: "真皮/Nappa", heating: "前后排", ventilation: "前后排" },
      media: { screen: "15.6寸旋转触控液晶屏", bluetooth: true, speakers: "Dynaudio 12喇叭", dlinkSystem: true },
      lights: { matrixLed: true, autoHeadlights: true, adaptiveHighBeam: true, ambientLight: "多色" },
      ac: { type: "自动空调", rearVents: true, zoneControl: true, pm25Filter: true },
    }
  },

  // ===== 宝马 =====
  {
    brand: "宝马", model: "3系", yearRange: "2016-2025",
    manufacturer: "华晨宝马", vehicleType: "中型车", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "B48B20C", intake: "涡轮增压", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 135, maxPowerPs: 184, maxTorque: 300, fuelGrade: "95号", fuelSupply: "直喷" },
      transmission: { type: "手自一体变速箱(AT)", description: "8速手自一体", gears: 8 },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2961, length: 4829, width: 1827, height: 1463 },
      chassis: { drive: "前置后驱/前置四驱", frontSuspension: "双球节弹簧减振支柱", rearSuspension: "多连杆式" },
      safety: { driverAirbag: true, abs: true, cruiseControl: "定速巡航", rearRadar: true, runFlatTires: true },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金 18寸" },
      interior: { multiFunctionSteering: true, fullLCDCluster: true, iDrive: true },
      seats: { material: "Sensatec合成皮/真皮", memory: "驾驶座", heating: "前排可选" },
      media: { screen: "触控液晶屏 10.25寸", bluetooth: true, speakers: "6/Harman Kardon可选", carplay: true },
      lights: { ledHeadlights: true, autoHeadlights: true, adaptiveHeadlights: "可选" },
      ac: { type: "三区自动空调", rearVents: true, zoneControl: true },
    }
  },

  // ===== 奔驰 =====
  {
    brand: "奔驰", model: "C级", yearRange: "2016-2025",
    manufacturer: "北京奔驰", vehicleType: "中型车", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "M254", intake: "涡轮增压", displacement: "1.5/2.0", layout: "L", cylinders: "4", maxPowerKw: 150, maxTorque: 300, fuelGrade: "95号", mildHybrid: "48V" },
      transmission: { type: "手自一体变速箱(AT)", description: "9速手自一体(9G-TRONIC)", gears: 9 },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2954, length: 4882, width: 1820, height: 1461 },
      chassis: { drive: "前置后驱/前置四驱(4MATIC)", frontSuspension: "多连杆式", rearSuspension: "多连杆式" },
      safety: { driverAirbag: true, abs: true, cruiseControl: "定速巡航", autonomousBraking: true, attentionAssist: true },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金 18寸" },
      interior: { multiFunctionSteering: true, fullLCDCluster: true, mbux: true, ambientLight: "64色" },
      seats: { material: "ARTICO皮革/真皮", memory: "驾驶座", heating: "前排可选" },
      media: { screen: "11.9寸竖置触控屏", bluetooth: true, speakers: "Burmester可选", carplay: true, androidAuto: true },
      lights: { ledHeadlights: true, autoHeadlights: true, adaptiveHighBeam: true },
      ac: { type: "双区自动空调", rearVents: true, zoneControl: true },
    }
  },

  // ===== 大众 =====
  {
    brand: "大众", model: "朗逸", yearRange: "2016-2025",
    manufacturer: "上汽大众", vehicleType: "紧凑型车", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "EA211", intake: "自然吸气/涡轮增压", displacement: "1.5/1.4T", layout: "L", cylinders: "4", maxPowerKw: 83, maxTorque: 145, fuelGrade: "92号" },
      transmission: { type: "手自一体/双离合", description: "6AT/7DSG", gears: "6/7" },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2688, length: 4678, width: 1806, height: 1474, fuelEconomy: "5.5" },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "扭力梁式非独立悬架" },
      safety: { driverAirbag: true, abs: true, brakeAssist: true, rearRadar: "可选" },
      exterior: { sunroof: "电动天窗可选", wheels: "铝合金" },
      interior: { multiFunctionSteering: "可选", tripComputer: "单色/彩色" },
      seats: { material: "织物/仿皮可选" },
      media: { screen: "触控液晶屏 8寸可选", bluetooth: true, speakers: "6喇叭" },
      lights: { ledHeadlights: "可选", autoHeadlights: "可选" },
      ac: { type: "手动/自动空调可选", rearVents: "可选" },
    }
  },

  // ===== 日产 =====
  {
    brand: "日产", model: "轩逸", yearRange: "2016-2025",
    manufacturer: "东风日产", vehicleType: "紧凑型车", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "HR16", intake: "自然吸气", displacement: "1.6", layout: "L", cylinders: "4", maxPowerKw: 99, maxTorque: 159, fuelGrade: "92号", fuelSupply: "多点电喷" },
      transmission: { type: "CVT无级变速/手动", description: "XTRONIC CVT/5MT", gears: "CVT/5" },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2712, length: 4641, width: 1815, height: 1450, fuelEconomy: "5.2" },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "扭力梁式" },
      safety: { driverAirbag: true, abs: true, brakeAssist: true, autonomousBraking: "可选", laneDepartureWarning: "可选" },
      exterior: { sunroof: "电动天窗可选", wheels: "铝合金" },
      interior: { multiFunctionSteering: "可选", tripComputer: "彩色" },
      seats: { material: "织物/真皮可选", zeroGravity: "可选" },
      media: { screen: "触控液晶屏 8寸可选", bluetooth: true, speakers: "4喇叭" },
      lights: { ledHeadlights: "可选", autoHeadlights: "可选", daytimeRunning: "可选" },
      ac: { type: "手动/自动空调", rearVents: "可选" },
    }
  },

  // ===== 本田 =====
  {
    brand: "本田", model: "思域", yearRange: "2016-2025",
    manufacturer: "东风本田", vehicleType: "紧凑型车", releaseDate: "2016-04-01", energyType: "汽油",
    specs: {
      engine: { model: "L15B8/L15C8", intake: "涡轮增压", displacement: "1.5", layout: "L", cylinders: "4", maxPowerKw: 134, maxPowerPs: 182, maxTorque: 240, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "CVT无级变速/手动", description: "CVT/6MT", gears: "CVT/6" },
      body: { form: "三厢车/两厢车", doors: "4/5", seats: 5, wheelbase: 2735, length: 4674, width: 1802, height: 1415 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式" },
      safety: { driverAirbag: true, abs: true, cruiseControl: "自适应巡航可选", laneKeeping: "可选", autonomousBraking: "可选" },
      exterior: { sunroof: "电动天窗可选", wheels: "铝合金 17寸可选" },
      interior: { multiFunctionSteering: true, fullLCDCluster: "可选" },
      seats: { material: "织物/真皮可选" },
      media: { screen: "触控液晶屏 7/9寸", bluetooth: true, speakers: "8/BOSE可选" },
      lights: { ledHeadlights: "可选", autoHeadlights: "可选" },
      ac: { type: "自动空调", rearVents: "可选" },
    }
  },
  // ===== 哈弗 =====
  {
    brand: "哈弗", model: "H6", yearRange: "2016-2025",
    manufacturer: "长城汽车", vehicleType: "紧凑型SUV", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "GW4B15A", intake: "涡轮增压", displacement: "1.5", layout: "L", cylinders: "4", valvesPerCylinder: "4", maxPowerKw: 124, maxPowerPs: 169, maxTorque: 285, maxTorqueRpm: "1400-3600", fuelGrade: "92号", fuelSupply: "直喷", headMaterial: "铝合金", blockMaterial: "铝合金" },
      transmission: { type: "湿式双离合变速箱(DCT)", description: "7挡湿式双离合", gears: 7 },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2738, length: 4653, width: 1886, height: 1730, fuelTank: 58, curbWeight: 1520 },
      chassis: { drive: "前置前驱/前置四驱", frontSuspension: "麦弗逊式独立悬架", rearSuspension: "多连杆式独立悬架", frontBrake: "通风盘式", rearBrake: "盘式", steeringAssist: "电动助力", structure: "承载式", parkingBrake: "电子驻车", frontTire: "225/65 R17", rearTire: "225/65 R17", spareTire: "非全尺寸", warranty: "三年或10万公里" },
      safety: { driverAirbag: true, frontSideAirbags: true, seatbeltReminder: "全车", abs: true, cruiseControl: "自适应巡航", rearRadar: true, panoramicCamera: "360", hillAssist: true, hillDescent: true, autoHold: true },
      exterior: { sunroof: "可开启全景天窗", panoramicRoof: "可开启全景天窗", wheels: "铝合金 18寸", roofRails: true, engineImmobilizer: true, centralLocking: true, remoteKey: "遥控钥匙/蓝牙钥匙" },
      interior: { multiFunctionSteering: true, steeringHeating: "可选", tripComputer: "彩色", fullLCDCluster: true, hud: "可选" },
      seats: { material: "仿皮/真皮", frontHeating: "加热可选", frontVentilation: "可选", rearHeating: "可选", rearCupHolder: true },
      media: { screen: "触控液晶屏 12.3寸", bluetooth: true, speakers: "6-8喇叭", otaUpgrade: true, voiceControl: true },
      lights: { ledHeadlights: true, matrixLed: "可选", autoHeadlights: true, daytimeRunning: true, headlightAdjustable: true, adaptiveHighBeam: "可选" },
      mirrors: { adjustment: "电动调节", heating: true, folding: "电动折叠", memory: "可选" },
      wipers: { rainSensing: "雨量感应式可选" },
      ac: { type: "自动空调", rearVents: true, zoneControl: true, pm25Filter: true },
    }
  },
  {
    brand: "哈弗", model: "H9", yearRange: "2016-2024",
    manufacturer: "长城汽车", vehicleType: "中大型SUV", releaseDate: "2016-01-01", energyType: "汽油/柴油",
    specs: {
      engine: { model: "GW4C20B", intake: "涡轮增压", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 165, maxPowerPs: 224, maxTorque: 385, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "手自一体变速箱(AT)", description: "8速手自一体", gears: 8 },
      body: { form: "SUV", doors: 5, seats: "5/7", wheelbase: 2800, length: 4856, width: 1926, height: 1900 },
      chassis: { drive: "前置四驱", frontSuspension: "双叉臂式独立悬架", rearSuspension: "多连杆非独立悬架", lowRangeGear: true, diffLock: "后桥差速锁可选" },
      safety: { driverAirbag: true, abs: true, cruiseControl: "自适应巡航", panoramicCamera: "360", offroadModes: "沙地/泥地/雪地/岩石" },
      exterior: { sunroof: "电动天窗可选", wheels: "铝合金 17/18寸", spareTire: "背负式/底挂式" },
      interior: { multiFunctionSteering: true, tripComputer: "彩色", fullLCDCluster: true },
      seats: { material: "仿皮/真皮", heating: "前排可选" },
      media: { screen: "触控液晶屏 9寸", bluetooth: true, speakers: "Infinity 10喇叭可选" },
      lights: { xenonHeadlights: true, autoHeadlights: true, daytimeRunning: true, headlightWasher: true },
      ac: { type: "自动空调", rearVents: true, zoneControl: true },
    }
  },

  // ===== 长安 =====
  {
    brand: "长安", model: "CS75 Plus", yearRange: "2019-2025",
    manufacturer: "长安汽车", vehicleType: "紧凑型SUV", releaseDate: "2019-09-01", energyType: "汽油",
    specs: {
      engine: { model: "JL476ZQCF", intake: "涡轮增压", displacement: "1.5", layout: "L", cylinders: "4", valvesPerCylinder: "4", maxPowerKw: 131, maxPowerPs: 178, maxTorque: 265, maxTorqueRpm: "1450-4500", fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "手自一体变速箱(AT)", description: "6速/8速手自一体", gears: "6/8" },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2710, length: 4700, width: 1865, height: 1710, fuelTank: 58, curbWeight: 1560 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式独立悬架", rearSuspension: "多连杆式独立悬架", frontBrake: "通风盘式", rearBrake: "盘式", steeringAssist: "电动助力", structure: "承载式", parkingBrake: "电子驻车" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "全速自适应巡航", laneKeeping: true, autonomousBraking: true, rearRadar: true, panoramicCamera: "360", hillAssist: true, autoHold: true, tpms: true },
      exterior: { sunroof: "可开启全景天窗", panoramicRoof: "可开启全景天窗", wheels: "铝合金 18/19寸", engineImmobilizer: true, centralLocking: true, remoteKey: "遥控钥匙/蓝牙钥匙" },
      interior: { multiFunctionSteering: true, tripComputer: "彩色", fullLCDCluster: true, wirelessCharging: "可选", ambientLight: "多色可选" },
      seats: { material: "仿皮/真皮", frontHeating: "加热可选", frontVentilation: "可选", driverElectric: true, rearCupHolder: true, rearFoldRatio: "4/6" },
      media: { screen: "联屏 12.3+12.3寸", bluetooth: true, speakers: "6-8喇叭 Sony可选", carplay: "可选", otaUpgrade: true, voiceControl: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true, headlightAdjustable: true, adaptiveHighBeam: "可选" },
      mirrors: { adjustment: "电动调节", heating: true, folding: "电动折叠", memory: "驾驶座可选" },
      wipers: { rainSensing: "雨量感应式可选" },
      ac: { type: "自动空调", rearVents: true, zoneControl: true, pm25Filter: true },
    }
  },

  // ===== 吉利 =====
  {
    brand: "吉利", model: "博越", yearRange: "2016-2025",
    manufacturer: "吉利汽车", vehicleType: "紧凑型SUV", releaseDate: "2016-03-01", energyType: "汽油",
    specs: {
      engine: { model: "JLH-4G20TD", intake: "涡轮增压", displacement: "1.8", layout: "L", cylinders: "4", valvesPerCylinder: "4", maxPowerKw: 135, maxPowerPs: 184, maxTorque: 300, maxTorqueRpm: "1750-4000", fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "湿式双离合变速箱(DCT)", description: "7挡湿式双离合", gears: 7 },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2670, length: 4544, width: 1831, height: 1713, fuelTank: 58, curbWeight: 1575 },
      chassis: { drive: "前置前驱/前置四驱", frontSuspension: "麦弗逊式独立悬架", rearSuspension: "多连杆式独立悬架", frontBrake: "通风盘式", rearBrake: "盘式", steeringAssist: "电动助力", structure: "承载式", parkingBrake: "电子驻车" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "自适应巡航", laneKeeping: "可选", autonomousBraking: "可选", rearRadar: true, panoramicCamera: "360", hillAssist: true, hillDescent: true, autoHold: true, tpms: true },
      exterior: { sunroof: "可开启全景天窗", panoramicRoof: "可开启全景天窗", wheels: "铝合金 18寸", engineImmobilizer: true, centralLocking: true, remoteKey: "遥控钥匙" },
      interior: { multiFunctionSteering: true, tripComputer: "彩色", fullLCDCluster: true, ambientLight: "可选" },
      seats: { material: "仿皮/真皮Nappa", frontHeating: "加热可选", frontVentilation: "可选", driverElectric: true, rearCupHolder: true },
      media: { screen: "触控液晶屏 12.3寸", bluetooth: true, speakers: "6-8喇叭 BOSE可选", otaUpgrade: true, voiceControl: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true, headlightAdjustable: true, adaptiveHighBeam: "可选" },
      mirrors: { adjustment: "电动调节", heating: true, folding: "电动折叠", memory: "可选" },
      wipers: { rainSensing: "雨量感应式可选" },
      ac: { type: "自动空调", rearVents: true, zoneControl: true, pm25Filter: true },
    }
  },

  // ===== 广汽传祺 =====
  {
    brand: "广汽传祺", model: "GS4", yearRange: "2016-2025",
    manufacturer: "广汽乘用车", vehicleType: "紧凑型SUV", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "4A15J2", intake: "涡轮增压", displacement: "1.5", layout: "L", cylinders: "4", valvesPerCylinder: "4", maxPowerKw: 124, maxPowerPs: 169, maxTorque: 265, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "手自一体变速箱(AT)", description: "6速手自一体", gears: 6 },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2680, length: 4545, width: 1856, height: 1700, curbWeight: 1480 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, abs: true, cruiseControl: "定速巡航/自适应巡航可选", rearRadar: true, hillAssist: true, hillDescent: true },
      exterior: { sunroof: "可开启全景天窗可选", wheels: "铝合金 17/18寸" },
      interior: { multiFunctionSteering: true, fullLCDCluster: "可选", tripComputer: "彩色" },
      seats: { material: "仿皮", heating: "前排可选" },
      media: { screen: "触控液晶屏 10.25/12.3寸", bluetooth: true, speakers: "6喇叭", voiceControl: true },
      lights: { ledHeadlights: "可选", autoHeadlights: "可选", daytimeRunning: true },
      ac: { type: "自动空调", rearVents: true, pm25Filter: true },
    }
  },

  // ===== 奇瑞 =====
  {
    brand: "奇瑞", model: "瑞虎8", yearRange: "2018-2025",
    manufacturer: "奇瑞汽车", vehicleType: "中型SUV", releaseDate: "2018-04-01", energyType: "汽油",
    specs: {
      engine: { model: "SQRF4J16", intake: "涡轮增压", displacement: "1.6", layout: "L", cylinders: "4", valvesPerCylinder: "4", maxPowerKw: 145, maxPowerPs: 197, maxTorque: 290, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "湿式双离合变速箱(DCT)", description: "7挡湿式双离合", gears: 7 },
      body: { form: "SUV", doors: 5, seats: "5/7", wheelbase: 2710, length: 4700, width: 1860, height: 1746, fuelTank: 51, curbWeight: 1544 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式独立悬架", rearSuspension: "多连杆式独立悬架", frontBrake: "通风盘式", rearBrake: "盘式", steeringAssist: "电动助力", structure: "承载式" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "自适应巡航", laneKeeping: "可选", autonomousBraking: "可选", panoramicCamera: "360", hillAssist: true, autoHold: true },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金 18/19寸", engineImmobilizer: true, remoteKey: "遥控钥匙" },
      interior: { multiFunctionSteering: true, tripComputer: "彩色", fullLCDCluster: true, ambientLight: "多色可选" },
      seats: { material: "仿皮", heating: "前排可选", driverElectric: true, rearCupHolder: true },
      media: { screen: "双联屏 12.3+12.3寸", bluetooth: true, speakers: "6-8喇叭 Sony可选", carplay: "可选", otaUpgrade: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true, headlightAdjustable: true },
      mirrors: { adjustment: "电动调节", heating: true, folding: "电动折叠" },
      ac: { type: "自动空调", rearVents: true, zoneControl: true, pm25Filter: true },
    }
  },

  // ===== 荣威 =====
  {
    brand: "荣威", model: "RX5", yearRange: "2016-2025",
    manufacturer: "上汽集团", vehicleType: "紧凑型SUV", releaseDate: "2016-07-01", energyType: "汽油/混动",
    specs: {
      engine: { model: "15C4E", intake: "涡轮增压", displacement: "1.5", layout: "L", cylinders: "4", maxPowerKw: 133, maxPowerPs: 181, maxTorque: 285, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "湿式双离合变速箱(DCT)", description: "7挡湿式双离合", gears: 7 },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2708, length: 4571, width: 1855, height: 1719, curbWeight: 1539 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, abs: true, cruiseControl: "自适应巡航可选", rearRadar: true, panoramicCamera: "360可选", hillAssist: true, autoHold: true },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金 18寸", remoteKey: "遥控钥匙/蓝牙钥匙" },
      interior: { multiFunctionSteering: true, fullLCDCluster: true, tripComputer: "彩色" },
      seats: { material: "仿皮", heating: "前排可选" },
      media: { screen: "竖版触控液晶屏 14.1寸", bluetooth: true, speakers: "6喇叭", internetCar: "斑马智行", voiceControl: true, otaUpgrade: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true, matrixLed: "可选" },
      ac: { type: "自动空调", rearVents: true, pm25Filter: true },
    }
  },

  // ===== 红旗 =====
  {
    brand: "红旗", model: "H5", yearRange: "2018-2025",
    manufacturer: "一汽红旗", vehicleType: "中型车", releaseDate: "2018-04-01", energyType: "汽油",
    specs: {
      engine: { model: "CA4GB15TD-30", intake: "涡轮增压", displacement: "1.5", layout: "L", cylinders: "4", maxPowerKw: 124, maxPowerPs: 169, maxTorque: 258, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "湿式双离合变速箱(DCT)", description: "7挡湿式双离合", gears: 7 },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2875, length: 4945, width: 1845, height: 1470 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "自适应巡航", laneKeeping: true, autonomousBraking: true, panoramicCamera: "360", hillAssist: true, autoHold: true },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金 17/19寸", remoteKey: "遥控钥匙" },
      interior: { multiFunctionSteering: true, fullLCDCluster: true, tripComputer: "彩色", ambientLight: "多色可选" },
      seats: { material: "仿皮/真皮", heating: "前排可选", driverElectric: true, bossSeatButton: true },
      media: { screen: "触控液晶屏 10寸", bluetooth: true, speakers: "8-11喇叭 BOSE可选", carplay: "可选" },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: "可选" },
      ac: { type: "自动空调", rearVents: true, zoneControl: true, pm25Filter: true },
    }
  },

  // ===== 丰田补充 =====
  {
    brand: "丰田", model: "普拉多", yearRange: "2016-2025",
    manufacturer: "一汽丰田", vehicleType: "中大型SUV", releaseDate: "2016-01-01", energyType: "汽油/柴油",
    specs: {
      engine: { model: "7GR-FKS", intake: "自然吸气", displacement: "3.5", layout: "V", cylinders: "6", valvesPerCylinder: "4", valveTrain: "DOHC", maxPowerKw: 206, maxPowerPs: 280, maxTorque: 365, fuelGrade: "92号", fuelSupply: "混合喷射" },
      transmission: { type: "手自一体变速箱(AT)", description: "6速手自一体", gears: 6 },
      body: { form: "SUV", doors: 5, seats: 7, wheelbase: 2790, length: 4840, width: 1885, height: 1890, fuelTank: 87, curbWeight: 2285 },
      chassis: { drive: "前置四驱(全时四驱)", frontSuspension: "双叉臂式独立悬架", rearSuspension: "四连杆非独立悬架", frontBrake: "通风盘式", rearBrake: "通风盘式", steeringAssist: "液压助力", structure: "非承载式", lowRangeGear: true, diffLock: "中央差速锁+后桥差速锁可选", kdss: true },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, kneeAirbag: true, abs: true, cruiseControl: "自适应巡航", laneKeeping: true, rearRadar: true, panoramicCamera: "360", hillAssist: true, hillDescent: true, offroadModes: "多地形选择" },
      exterior: { sunroof: "电动天窗", wheels: "铝合金 18寸", roofRails: true, sideSteps: true, spareTire: "底挂式/后挂式", engineImmobilizer: true, centralLocking: true, remoteKey: "遥控钥匙" },
      interior: { multiFunctionSteering: true, steeringHeating: true, tripComputer: "彩色", fullLCDCluster: false, refrigerator: true },
      seats: { material: "真皮", heating: "前后排", ventilation: "前排可选", driverElectric: true, thirdRowSeats: true, rearCupHolder: true },
      media: { screen: "触控液晶屏 9/12.3寸", bluetooth: true, speakers: "JBL 14喇叭可选", rearEntertainment: "可选", carplay: "可选" },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true, headlightAdjustable: true, headlightWasher: true },
      mirrors: { adjustment: "电动调节", heating: true, folding: "电动折叠", memory: true, autoDimming: true },
      wipers: { rainSensing: "雨量感应式" },
      ac: { type: "自动空调", rearVents: true, zoneControl: "三区", pm25Filter: true },
    }
  },
  {
    brand: "丰田", model: "汉兰达", yearRange: "2016-2025",
    manufacturer: "广汽丰田", vehicleType: "中型SUV", releaseDate: "2016-01-01", energyType: "汽油/混动",
    specs: {
      engine: { model: "8AR-FTS", intake: "涡轮增压", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 162, maxPowerPs: 220, maxTorque: 350, fuelGrade: "92号", fuelSupply: "混合喷射" },
      transmission: { type: "手自一体变速箱(AT)", description: "6速手自一体", gears: 6 },
      body: { form: "SUV", doors: 5, seats: "5/7", wheelbase: 2850, length: 4965, width: 1930, height: 1750, fuelTank: 65, curbWeight: 1930 },
      chassis: { drive: "前置前驱/前置四驱", frontSuspension: "麦弗逊式", rearSuspension: "双叉臂式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, kneeAirbag: true, abs: true, cruiseControl: "自适应巡航", laneKeeping: true, autonomousBraking: true, rearRadar: true, panoramicCamera: "可选" },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金 18/20寸", roofRails: true },
      interior: { multiFunctionSteering: true, tripComputer: "彩色", fullLCDCluster: "可选", ambientLight: "可选" },
      seats: { material: "真皮/仿皮", heating: "前排可选", ventilation: "可选", rearCupHolder: true },
      media: { screen: "触控液晶屏 8/12.3寸", bluetooth: true, speakers: "6-11喇叭 JBL可选", carplay: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: "可选" },
      ac: { type: "自动空调", rearVents: true, zoneControl: "三区", pm25Filter: true },
    }
  },
  {
    brand: "丰田", model: "海拉克斯", yearRange: "2016-2025",
    manufacturer: "丰田(进口)", vehicleType: "皮卡", releaseDate: "2016-01-01", energyType: "柴油",
    specs: {
      engine: { model: "2GD-FTV", intake: "涡轮增压", displacement: "2.4", layout: "L", cylinders: "4", maxPowerKw: 110, maxPowerPs: 150, maxTorque: 400, fuelGrade: "0号柴油", fuelSupply: "高压共轨直喷" },
      transmission: { type: "手自一体变速箱(AT)/手动", description: "6速手自一体/6速手动", gears: 6 },
      body: { form: "皮卡", doors: 4, seats: 5, wheelbase: 3085, length: 5335, width: 1855, height: 1815, cargoBox: "1555x1545x480", curbWeight: 2095, payload: "约1000kg" },
      chassis: { drive: "前置四驱(分时四驱)", frontSuspension: "双叉臂式螺旋弹簧", rearSuspension: "钢板弹簧", frontBrake: "通风盘式", rearBrake: "鼓式", steeringAssist: "液压助力", structure: "非承载式", lowRangeGear: true, diffLock: "后桥差速锁可选" },
      safety: { driverAirbag: true, abs: true, hillAssist: true, hillDescent: true, vsc: true },
      exterior: { wheels: "钢/铝合金 17寸", snorkel: "可选", rollBar: true, bedLiner: "可选" },
      interior: { multiFunctionSteering: true, tripComputer: true },
      seats: { material: "织物/仿皮", driverManual: true },
      media: { screen: "触控液晶屏可选", bluetooth: true, speakers: "4-6喇叭" },
      lights: { halogenHeadlights: true, ledHeadlights: "可选", daytimeRunning: "可选" },
      ac: { type: "手动/自动空调" },
    }
  },

  // ===== 日产补充 =====
  {
    brand: "日产", model: "奇骏", yearRange: "2016-2025",
    manufacturer: "东风日产", vehicleType: "紧凑型SUV", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "MR20DD", intake: "自然吸气", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 111, maxPowerPs: 151, maxTorque: 194, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "CVT无级变速", description: "CVT模拟7挡", gears: "CVT" },
      body: { form: "SUV", doors: 5, seats: "5/7", wheelbase: 2706, length: 4681, width: 1840, height: 1730, fuelTank: 55, curbWeight: 1576 },
      chassis: { drive: "前置前驱/前置四驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, abs: true, cruiseControl: "定速巡航/自适应巡航可选", laneKeeping: "可选", autonomousBraking: "可选", rearRadar: true, panoramicCamera: "360可选" },
      exterior: { sunroof: "可开启全景天窗可选", wheels: "铝合金 17/19寸", roofRails: true },
      interior: { multiFunctionSteering: true, tripComputer: "彩色", fullLCDCluster: "可选", hud: "可选" },
      seats: { material: "真皮/仿皮", heating: "前排可选", rearCupHolder: true },
      media: { screen: "触控液晶屏 9/12.3寸", bluetooth: true, speakers: "6-8喇叭 BOSE可选", nissanConnect: true },
      lights: { ledHeadlights: "可选", autoHeadlights: true, daytimeRunning: true },
      ac: { type: "自动/双区自动空调", rearVents: true, pm25Filter: true },
    }
  },

  // ===== 本田补充 =====
  {
    brand: "本田", model: "CR-V", yearRange: "2016-2025",
    manufacturer: "东风本田", vehicleType: "紧凑型SUV", releaseDate: "2016-01-01", energyType: "汽油/混动",
    specs: {
      engine: { model: "L15BL", intake: "涡轮增压", displacement: "1.5", layout: "L", cylinders: "4", maxPowerKw: 142, maxPowerPs: 193, maxTorque: 243, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "CVT无级变速", description: "CVT", gears: "CVT" },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2701, length: 4703, width: 1866, height: 1680, fuelTank: 53, curbWeight: 1598 },
      chassis: { drive: "前置前驱/前置四驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "自适应巡航", laneKeeping: true, autonomousBraking: true, rearRadar: true, panoramicCamera: "360可选", hondaSensing: true },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金 17/19寸", remoteKey: "遥控钥匙" },
      interior: { multiFunctionSteering: true, tripComputer: "彩色", fullLCDCluster: "可选", wirelessCharging: "可选", ambientLight: "可选" },
      seats: { material: "仿皮/真皮", heating: "前排可选", rearFoldRatio: "4/6" },
      media: { screen: "触控液晶屏 7/10.1寸", bluetooth: true, speakers: "8-12喇叭 BOSE可选", carplay: true, hondaConnect: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: "可选" },
      ac: { type: "自动空调", rearVents: true, zoneControl: true, pm25Filter: true },
    }
  },
  {
    brand: "本田", model: "雅阁", yearRange: "2016-2025",
    manufacturer: "广汽本田", vehicleType: "中型车", releaseDate: "2016-01-01", energyType: "汽油/混动",
    specs: {
      engine: { model: "L15CJ/L15CH", intake: "涡轮增压", displacement: "1.5", layout: "L", cylinders: "4", maxPowerKw: 143, maxPowerPs: 194, maxTorque: 260, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "CVT无级变速", description: "CVT", gears: "CVT" },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2830, length: 4980, width: 1862, height: 1449, curbWeight: 1471 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, kneeAirbag: "可选", abs: true, cruiseControl: "自适应巡航", laneKeeping: true, autonomousBraking: true, rearRadar: true, hondaSensing: true },
      exterior: { sunroof: "电动天窗/全景天窗可选", wheels: "铝合金 17/19寸" },
      interior: { multiFunctionSteering: true, tripComputer: "彩色", fullLCDCluster: true, hud: "可选", interiorMood: "可选" },
      seats: { material: "仿皮/真皮", heating: "前排可选", ventilation: "可选", driverElectric: true },
      media: { screen: "触控液晶屏 12.3寸", bluetooth: true, speakers: "8-12喇叭 BOSE可选", carplay: true, hondaConnect: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: true },
      ac: { type: "双区自动空调", rearVents: true, pm25Filter: true },
    }
  },

  // ===== 马自达 =====
  {
    brand: "马自达", model: "3 昂克赛拉", yearRange: "2016-2025",
    manufacturer: "长安马自达", vehicleType: "紧凑型车", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "SkyActiv-G", intake: "自然吸气", displacement: "1.5", layout: "L", cylinders: "4", maxPowerKw: 86, maxPowerPs: 117, maxTorque: 148, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "手自一体变速箱(AT)", description: "6速手自一体", gears: 6 },
      body: { form: "三厢车/两厢车", doors: "4/5", seats: 5, wheelbase: 2726, length: 4662, width: 1797, height: 1445, curbWeight: 1385 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "扭力梁非独立悬架", steeringAssist: "电动助力", gvc: true },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, kneeAirbag: true, abs: true, cruiseControl: "自适应巡航可选", laneKeeping: "可选", autonomousBraking: "可选", rearRadar: true },
      exterior: { sunroof: "电动天窗可选", wheels: "铝合金 16/18寸" },
      interior: { multiFunctionSteering: true, fullLCDCluster: false, tripComputer: "彩色", hud: "可选" },
      seats: { material: "织物/真皮", heating: "可选" },
      media: { screen: "悬浮式触控液晶屏 8.8寸", bluetooth: true, speakers: "8/BOSE可选", carplay: true, mazdaConnect: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: "可选" },
      ac: { type: "自动/双区自动空调", rearVents: true },
    }
  },
  {
    brand: "马自达", model: "6 阿特兹", yearRange: "2016-2024",
    manufacturer: "一汽马自达/长安马自达", vehicleType: "中型车", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "SkyActiv-G", intake: "自然吸气", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 116, maxPowerPs: 158, maxTorque: 202, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "手自一体变速箱(AT)", description: "6速手自一体", gears: 6 },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2830, length: 4870, width: 1840, height: 1451, curbWeight: 1497 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力", gvc: true },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "自适应巡航可选", laneKeeping: "可选", autonomousBraking: "可选", rearRadar: true, blindSpot: true },
      exterior: { sunroof: "电动天窗可选", wheels: "铝合金 17/19寸" },
      interior: { multiFunctionSteering: true, tripComputer: "彩色", fullLCDCluster: false, hud: "可选" },
      seats: { material: "真皮/Nappa可选", heating: "前后排可选", ventilation: "前排可选", driverMemory: true },
      media: { screen: "悬浮式触控液晶屏 8寸", bluetooth: true, speakers: "6-11喇叭 BOSE可选", carplay: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: true, afs: "可选" },
      ac: { type: "双区自动空调", rearVents: true },
    }
  },

  // ===== 雷克萨斯 =====
  {
    brand: "雷克萨斯", model: "ES", yearRange: "2016-2025",
    manufacturer: "雷克萨斯(进口)", vehicleType: "中大型车", releaseDate: "2016-01-01", energyType: "汽油/混动",
    specs: {
      engine: { model: "6AR-FSE/A25A-FKS", intake: "自然吸气", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 127, maxPowerPs: 173, maxTorque: 208, fuelGrade: "92号", fuelSupply: "混合喷射" },
      transmission: { type: "CVT无级变速(Direct Shift-CVT)/手自一体(AT)", description: "CVT/8AT", gears: "CVT/8" },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2870, length: 4975, width: 1866, height: 1447, fuelTank: 60, curbWeight: 1610 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, kneeAirbag: true, rearSideAirbags: true, abs: true, cruiseControl: "全速自适应巡航", laneKeeping: true, autonomousBraking: true, rearRadar: true, panoramicCamera: "360可选", lexusSafetySystem: true },
      exterior: { sunroof: "电动天窗/全景天窗可选", wheels: "铝合金 17/18寸", remoteKey: "智能钥匙" },
      interior: { multiFunctionSteering: true, tripComputer: "彩色", fullLCDCluster: "可选", analogClock: true, ambientLight: "可选", powerRearSunshade: "可选" },
      seats: { material: "真皮/Nuluxe环保皮", heating: "前后排可选", ventilation: "前排可选", driverMemory: true, passengerElectric: true },
      media: { screen: "触控液晶屏 8/12.3寸", bluetooth: true, speakers: "10-17喇叭 Mark Levinson可选", carplay: true, lexusRemoteTouch: true },
      lights: { ledHeadlights: true, matrixLed: "三眼式可选", autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: true, headlightWasher: true },
      ac: { type: "双区/三区自动空调", rearVents: true, nanoeX: true, pm25Filter: true },
    }
  },
  {
    brand: "雷克萨斯", model: "RX", yearRange: "2016-2025",
    manufacturer: "雷克萨斯(进口)", vehicleType: "中大型SUV", releaseDate: "2016-01-01", energyType: "汽油/混动",
    specs: {
      engine: { model: "8AR-FTS", intake: "涡轮增压", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 170, maxPowerPs: 231, maxTorque: 350, fuelGrade: "95号", fuelSupply: "混合喷射" },
      transmission: { type: "手自一体变速箱(AT)", description: "6速/8速手自一体", gears: "6/8" },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2790, length: 4890, width: 1895, height: 1710, curbWeight: 2040 },
      chassis: { drive: "前置前驱/前置四驱", frontSuspension: "麦弗逊式", rearSuspension: "双叉臂式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, kneeAirbag: true, abs: true, cruiseControl: "全速自适应巡航", laneKeeping: true, autonomousBraking: true, panoramicCamera: "360可选", lexusSafetySystem: true },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金 18/20寸", roofRails: true },
      interior: { multiFunctionSteering: true, tripComputer: "彩色", fullLCDCluster: true, analogClock: true, ambientLight: "可选", powerRearSunshade: "可选" },
      seats: { material: "真皮/Semi-Aniline", heating: "前后排可选", ventilation: "前排可选", driverMemory: true },
      media: { screen: "触控液晶屏 8/12.3/14寸", bluetooth: true, speakers: "9-15喇叭 Mark Levinson可选", carplay: true, rearEntertainment: "可选" },
      lights: { ledHeadlights: true, matrixLed: "三眼式可选", autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: true, headlightWasher: true },
      ac: { type: "双区/三区自动空调", rearVents: true, nanoeX: true, rearAcControl: true },
    }
  },

  // ===== 现代 =====
  {
    brand: "现代", model: "伊兰特", yearRange: "2016-2025",
    manufacturer: "北京现代", vehicleType: "紧凑型车", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "G4FL/G4LD", intake: "自然吸气", displacement: "1.5", layout: "L", cylinders: "4", maxPowerKw: 84, maxPowerPs: 115, maxTorque: 144, fuelGrade: "92号", fuelSupply: "多点电喷" },
      transmission: { type: "CVT无级变速", description: "IVT智能无级变速", gears: "CVT" },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2720, length: 4680, width: 1810, height: 1415, curbWeight: 1240 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "扭力梁非独立悬架", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "定速巡航/自适应巡航可选", laneKeeping: "可选", autonomousBraking: "可选", rearRadar: "可选" },
      exterior: { sunroof: "电动天窗可选", wheels: "铝合金 15/17寸" },
      interior: { multiFunctionSteering: true, tripComputer: "彩色", fullLCDCluster: "可选" },
      seats: { material: "织物/仿皮", heating: "前排可选" },
      media: { screen: "触控液晶屏 8/10.25寸", bluetooth: true, speakers: "4-6喇叭", carplay: "可选" },
      lights: { ledHeadlights: true, autoHeadlights: "可选", daytimeRunning: true },
      ac: { type: "手动/自动空调" },
    }
  },
  {
    brand: "现代", model: "途胜", yearRange: "2016-2025",
    manufacturer: "北京现代", vehicleType: "紧凑型SUV", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "G4FS", intake: "涡轮增压", displacement: "1.5", layout: "L", cylinders: "4", maxPowerKw: 147, maxPowerPs: 200, maxTorque: 253, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "手自一体变速箱(AT)", description: "8速手自一体", gears: 8 },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2755, length: 4670, width: 1865, height: 1690, curbWeight: 1559 },
      chassis: { drive: "前置前驱/前置四驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, abs: true, cruiseControl: "自适应巡航可选", laneKeeping: "可选", autonomousBraking: "可选", rearRadar: true, panoramicCamera: "可选" },
      exterior: { sunroof: "可开启全景天窗可选", wheels: "铝合金 17/19寸" },
      interior: { multiFunctionSteering: true, tripComputer: "彩色", fullLCDCluster: true, ambientLight: "可选" },
      seats: { material: "仿皮/真皮", heating: "前排可选" },
      media: { screen: "触控液晶屏 10.4/12.3寸", bluetooth: true, speakers: "6-8喇叭", carplay: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true },
      ac: { type: "自动/双区自动空调", rearVents: true, pm25Filter: true },
    }
  },

  // ===== 起亚 =====
  {
    brand: "起亚", model: "K3", yearRange: "2016-2025",
    manufacturer: "悦达起亚", vehicleType: "紧凑型车", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "G4FL", intake: "自然吸气", displacement: "1.5", layout: "L", cylinders: "4", maxPowerKw: 84, maxPowerPs: 115, maxTorque: 144, fuelGrade: "92号", fuelSupply: "多点电喷" },
      transmission: { type: "CVT无级变速", description: "IVT", gears: "CVT" },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2700, length: 4660, width: 1780, height: 1450, curbWeight: 1230 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "扭力梁", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, abs: true, cruiseControl: "定速巡航", rearRadar: "可选" },
      exterior: { sunroof: "电动天窗可选", wheels: "铝合金 16/17寸" },
      interior: { multiFunctionSteering: true, fullLCDCluster: "可选" },
      seats: { material: "织物/仿皮", heating: "前排可选" },
      media: { screen: "触控液晶屏 10.25寸", bluetooth: true, speakers: "6喇叭", carplay: "可选" },
      lights: { ledHeadlights: true, autoHeadlights: "可选", daytimeRunning: true },
      ac: { type: "手动/自动空调", rearVents: true },
    }
  },
  {
    brand: "起亚", model: "狮铂拓界", yearRange: "2016-2025",
    manufacturer: "悦达起亚", vehicleType: "紧凑型SUV", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "G4FS", intake: "涡轮增压", displacement: "1.5", layout: "L", cylinders: "4", maxPowerKw: 147, maxPowerPs: 200, maxTorque: 253, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "手自一体变速箱(AT)", description: "8速手自一体", gears: 8 },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2755, length: 4670, width: 1865, height: 1690, curbWeight: 1600 },
      chassis: { drive: "前置前驱/前置四驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, abs: true, cruiseControl: "自适应巡航可选", laneKeeping: "可选", autonomousBraking: "可选", rearRadar: true },
      exterior: { sunroof: "可开启全景天窗可选", wheels: "铝合金 17/19寸", roofRails: true },
      interior: { multiFunctionSteering: true, tripComputer: "彩色", fullLCDCluster: true },
      seats: { material: "仿皮/真皮", heating: "前排可选", ventilation: "可选" },
      media: { screen: "双联屏 12.3+12.3寸", bluetooth: true, speakers: "6-8喇叭 Harman Kardon可选", carplay: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true },
      ac: { type: "自动空调", rearVents: true, pm25Filter: true },
    }
  },

  // ===== 福特 =====
  {
    brand: "福特", model: "福克斯", yearRange: "2016-2023",
    manufacturer: "长安福特", vehicleType: "紧凑型车", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "CAF384WQ", intake: "自然吸气/涡轮增压", displacement: "1.5", layout: "L", cylinders: "3/4", maxPowerKw: 128, maxPowerPs: 174, maxTorque: 243, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "手自一体变速箱(AT)", description: "6速/8速手自一体", gears: "6/8" },
      body: { form: "三厢车/两厢车", doors: "4/5", seats: 5, wheelbase: 2705, length: 4647, width: 1810, height: 1468, curbWeight: 1415 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式/扭力梁", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "定速巡航", rearRadar: true },
      exterior: { sunroof: "电动天窗/全景天窗可选", wheels: "铝合金 16/18寸" },
      interior: { multiFunctionSteering: true, fullLCDCluster: "可选", tripComputer: "彩色" },
      seats: { material: "织物/仿皮" },
      media: { screen: "触控液晶屏 8/12.3寸", bluetooth: true, speakers: "6-10喇叭 B&O可选", carplay: true, sync: true },
      lights: { ledHeadlights: "可选", autoHeadlights: true, daytimeRunning: true },
      ac: { type: "手动/自动空调", rearVents: "可选" },
    }
  },
  {
    brand: "福特", model: "探险者", yearRange: "2016-2025",
    manufacturer: "长安福特", vehicleType: "中大型SUV", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "CAF488WQGA", intake: "涡轮增压", displacement: "2.3", layout: "L", cylinders: "4", maxPowerKw: 203, maxPowerPs: 276, maxTorque: 425, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "手自一体变速箱(AT)", description: "10速手自一体", gears: 10 },
      body: { form: "SUV", doors: 5, seats: "6/7", wheelbase: 3025, length: 5075, width: 2004, height: 1778, curbWeight: 2059 },
      chassis: { drive: "前置后驱/前置四驱", frontSuspension: "双球节麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, kneeAirbag: true, abs: true, cruiseControl: "全速自适应巡航", laneKeeping: true, autonomousBraking: true, rearRadar: true, panoramicCamera: "360", autoPark: true },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金 20/21寸", roofRails: true, powerLiftgate: true },
      interior: { multiFunctionSteering: true, steeringHeating: true, tripComputer: "彩色", fullLCDCluster: true, hud: "可选", wirelessCharging: true },
      seats: { material: "真皮", heating: "前后排可选", ventilation: "前排可选", massage: "可选", driverMemory: true, thirdRowSeats: true },
      media: { screen: "竖版触控液晶屏 27寸", bluetooth: true, speakers: "12-14喇叭 B&O可选", carplay: true, sync4: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: true },
      mirrors: { adjustment: "电动调节", heating: true, folding: "电动折叠", memory: true, autoDimming: true },
      ac: { type: "三区自动空调", rearVents: true, pm25Filter: true },
    }
  },

  // ===== 别克 =====
  {
    brand: "别克", model: "英朗", yearRange: "2016-2024",
    manufacturer: "上汽通用别克", vehicleType: "紧凑型车", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "L2B/LIY", intake: "自然吸气/涡轮增压", displacement: "1.5/1.3", layout: "L", cylinders: "4/3", maxPowerKw: 83, maxPowerPs: 113, maxTorque: 141, fuelGrade: "92号", fuelSupply: "多点电喷" },
      transmission: { type: "手自一体变速箱(AT)", description: "6速手自一体", gears: 6 },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2640, length: 4609, width: 1798, height: 1464, curbWeight: 1270 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, abs: true, cruiseControl: "定速巡航可选", rearRadar: "可选" },
      exterior: { sunroof: "电动天窗可选", wheels: "铝合金 16寸" },
      interior: { multiFunctionSteering: true, tripComputer: "彩色" },
      seats: { material: "织物/仿皮" },
      media: { screen: "触控液晶屏 7寸可选", bluetooth: true, speakers: "6-7喇叭", carplay: "可选" },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true },
      ac: { type: "手动/自动空调", rearVents: true, pm25Filter: true },
    }
  },
  {
    brand: "别克", model: "GL8", yearRange: "2016-2025",
    manufacturer: "上汽通用别克", vehicleType: "MPV", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "LXH", intake: "涡轮增压", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 174, maxPowerPs: 237, maxTorque: 350, fuelGrade: "92号", fuelSupply: "直喷", mildHybrid: "48V" },
      transmission: { type: "手自一体变速箱(AT)", description: "9速手自一体", gears: 9 },
      body: { form: "MPV", doors: 5, seats: "7", wheelbase: 3088, length: 5238, width: 1878, height: 1800, fuelTank: 70, curbWeight: 1950 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "四连杆独立悬架", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "自适应巡航", laneKeeping: true, autonomousBraking: true, rearRadar: true, panoramicCamera: "360" },
      exterior: { sunroof: "双天窗", wheels: "铝合金 17/18寸", slidingDoors: "双侧电动滑门", powerLiftgate: true },
      interior: { multiFunctionSteering: true, tripComputer: "彩色", fullLCDCluster: true, ambientLight: "多色可选" },
      seats: { material: "真皮", heating: "前排可选", ventilation: "前排可选", massage: "可选", secondRowCaptain: true, thirdRowFold: true },
      media: { screen: "双联屏 12.3+12.3寸", bluetooth: true, speakers: "8-12喇叭 BOSE可选", rearEntertainment: "可选", carplay: true },
      lights: { ledHeadlights: true, matrixLed: "可选", autoHeadlights: true, daytimeRunning: true },
      ac: { type: "三区自动空调", rearVents: true, pm25Filter: true, ionizer: true },
    }
  },

  // ===== 雪佛兰 =====
  {
    brand: "雪佛兰", model: "科鲁泽", yearRange: "2016-2023",
    manufacturer: "上汽通用雪佛兰", vehicleType: "紧凑型车", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "L2B", intake: "自然吸气", displacement: "1.5", layout: "L", cylinders: "4", maxPowerKw: 83, maxPowerPs: 113, maxTorque: 141, fuelGrade: "92号", fuelSupply: "多点电喷" },
      transmission: { type: "手自一体变速箱(AT)", description: "6速手自一体", gears: 6 },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2640, length: 4656, width: 1798, height: 1465, curbWeight: 1275 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, abs: true, cruiseControl: "定速巡航可选", rearRadar: "可选" },
      exterior: { sunroof: "电动天窗可选", wheels: "铝合金 16寸" },
      interior: { multiFunctionSteering: true, tripComputer: "单色" },
      seats: { material: "织物/仿皮" },
      media: { screen: "触控液晶屏 8寸可选", bluetooth: true, speakers: "6-7喇叭", carplay: "可选" },
      lights: { ledHeadlights: "可选", autoHeadlights: true, daytimeRunning: true },
      ac: { type: "手动/自动空调", rearVents: true },
    }
  },

  // ===== 特斯拉 =====
  {
    brand: "特斯拉", model: "Model 3", yearRange: "2019-2025",
    manufacturer: "特斯拉(上海)", vehicleType: "中型车", releaseDate: "2019-05-01", energyType: "纯电动",
    specs: {
      engine: { type: "纯电动", motorPower: "194(后驱)/331(四驱)", motorTorque: "340(后驱)/559(四驱)", batteryCapacity: "60/78.4kWh", batteryType: "磷酸铁锂/三元锂", range: "556/713/623km", acceleration: "6.1/4.4/3.3s(0-100)", topSpeed: "225/261km/h", charging: "快充15分钟250km", energyConsumption: "12.5kWh/100km" },
      transmission: { type: "固定齿比变速箱", description: "单速", gears: 1 },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2875, length: 4720, width: 1848, height: 1442, frunk: 88, trunk: 425, curbWeight: 1760 },
      chassis: { drive: "后置后驱/双电机四驱", frontSuspension: "双叉臂式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "Autopilot全速自适应", laneKeeping: true, autonomousBraking: true, panoramicCamera: "环视", sentryMode: true, fsd: "可选" },
      exterior: { glassRoof: "全景玻璃车顶", wheels: "铝合金 18/19寸", flushDoorHandles: true, framelessWindows: true },
      interior: { multiFunctionSteering: "滚轮式", tripComputer: "15寸触控屏", fullLCDCluster: "中控屏集成", wirelessCharging: true, campMode: true, dogMode: true, bioDefenseMode: true, heatedSteering: true },
      seats: { material: "仿皮/白色可选", heating: "前后排", driverMemory: true },
      media: { screen: "15寸触控液晶屏", bluetooth: true, speakers: "8-14喇叭 Premium可选", netflix: true, youtube: true, steam: "可选", otaUpgrade: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: true, fogLights: "LED前雾灯" },
      mirrors: { adjustment: "电动调节", heating: true, folding: "电动折叠", autoDimming: true, memory: true },
      wipers: { rainSensing: true },
      ac: { type: "双区自动空调", rearVents: true, pm25Filter: true, heatPump: true },
    }
  },
  {
    brand: "特斯拉", model: "Model Y", yearRange: "2021-2025",
    manufacturer: "特斯拉(上海)", vehicleType: "中型SUV", releaseDate: "2021-01-01", energyType: "纯电动",
    specs: {
      engine: { type: "纯电动", motorPower: "220(后驱)/331(四驱)/357(性能)", motorTorque: "440(后驱)/559(四驱)/659(性能)", batteryCapacity: "60/78.4kWh", batteryType: "磷酸铁锂/三元锂", range: "545/688/615km", acceleration: "5.9/5.0/3.7s(0-100)", topSpeed: "217/250km/h", charging: "快充15分钟250km", energyConsumption: "13.0kWh/100km" },
      transmission: { type: "固定齿比变速箱", description: "单速", gears: 1 },
      body: { form: "SUV", doors: 5, seats: "5/7可选", wheelbase: 2890, length: 4750, width: 1921, height: 1624, frunk: 117, trunk: 854, totalCargo: 2158, curbWeight: 1997, towCapacity: "1600kg" },
      chassis: { drive: "后置后驱/双电机四驱", frontSuspension: "双叉臂式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "Autopilot全速自适应", laneKeeping: true, autonomousBraking: true, sentryMode: true, fsd: "可选" },
      exterior: { glassRoof: "全景玻璃车顶", wheels: "铝合金 19/20/21寸", flushDoorHandles: true, powerLiftgate: true },
      interior: { multiFunctionSteering: "滚轮式", tripComputer: "15寸触控屏", fullLCDCluster: "中控屏集成", wirelessCharging: true, campMode: true, bioDefenseMode: true, heatedSteering: true },
      seats: { material: "仿皮/白色可选", heating: "前后排", driverMemory: true, foldFlat: true },
      media: { screen: "15寸触控液晶屏", bluetooth: true, speakers: "13-14喇叭 Premium", netflix: true, youtube: true, otaUpgrade: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: true, fogLights: "LED前雾灯" },
      mirrors: { adjustment: "电动调节", heating: true, folding: "电动折叠", autoDimming: true, memory: true },
      wipers: { rainSensing: true },
      ac: { type: "双区自动空调", rearVents: true, pm25Filter: true, heatPump: true, rearScreen: "8寸可选" },
    }
  },

  // ===== 宝马补充 =====
  {
    brand: "宝马", model: "5系", yearRange: "2016-2025",
    manufacturer: "华晨宝马", vehicleType: "中大型车", releaseDate: "2016-01-01", energyType: "汽油/混动",
    specs: {
      engine: { model: "B48B20D", intake: "涡轮增压", displacement: "2.0", layout: "L", cylinders: "4", valvesPerCylinder: "4", valveTrain: "DOHC", maxPowerKw: 185, maxPowerPs: 252, maxTorque: 350, fuelGrade: "95号", fuelSupply: "直喷" },
      transmission: { type: "手自一体变速箱(AT)", description: "8速手自一体 Steptronic", gears: 8 },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 3105, length: 5106, width: 1868, height: 1500, fuelTank: 68, curbWeight: 1775 },
      chassis: { drive: "前置后驱/前置四驱(xDrive)", frontSuspension: "双叉臂式独立悬架", rearSuspension: "多连杆式独立悬架", frontBrake: "通风盘式", rearBrake: "通风盘式", steeringAssist: "电动助力", structure: "承载式" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "自适应巡航", laneKeeping: true, autonomousBraking: true, rearRadar: true, panoramicCamera: "360可选", runFlatTires: true, autoPark: "可选" },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金 18/19/20寸", mSportPackage: "可选", adaptiveLed: "可选" },
      interior: { multiFunctionSteering: true, tripComputer: "彩色", fullLCDCluster: true, hud: "可选", ambientLight: "11色可选", iDrive: true, gestureControl: "可选", wirelessCharging: true },
      seats: { material: "Dakota真皮/Nappa可选", heating: "前排可选", ventilation: "前排可选", massage: "可选", driverMemory: true, rearHeating: "可选", rearSunshade: "电动可选" },
      media: { screen: "触控液晶屏 12.3寸", bluetooth: true, speakers: "12-16喇叭 Harman Kardon/B&W可选", carplay: true, rearEntertainment: "可选" },
      lights: { ledHeadlights: true, laserHeadlights: "可选", autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: true, welcomeLight: true },
      mirrors: { adjustment: "电动调节", heating: true, folding: "电动折叠", memory: true, autoDimming: true },
      wipers: { rainSensing: "雨量感应式" },
      ac: { type: "四区自动空调", rearVents: true, pm25Filter: true, ionizer: true, fragrance: "可选" },
    }
  },
  {
    brand: "宝马", model: "X5", yearRange: "2016-2025",
    manufacturer: "宝马(进口)/华晨宝马", vehicleType: "中大型SUV", releaseDate: "2016-01-01", energyType: "汽油/混动",
    specs: {
      engine: { model: "B58B30C", intake: "涡轮增压", displacement: "3.0", layout: "I", cylinders: "6", valvesPerCylinder: "4", maxPowerKw: 250, maxPowerPs: 340, maxTorque: 450, fuelGrade: "95号", fuelSupply: "直喷", mildHybrid: "48V" },
      transmission: { type: "手自一体变速箱(AT)", description: "8速手自一体 Steptronic", gears: 8 },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2975, length: 4930, width: 2004, height: 1776, fuelTank: 83, curbWeight: 2220 },
      chassis: { drive: "前置四驱(xDrive)", frontSuspension: "双叉臂式独立悬架", rearSuspension: "多连杆式独立悬架", frontBrake: "通风盘式", rearBrake: "通风盘式", steeringAssist: "电动助力", airSuspension: "可选" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "全速自适应巡航", laneKeeping: true, autonomousBraking: true, panoramicCamera: "360", autoPark: true, rearCrossTraffic: true },
      exterior: { sunroof: "全景星空天窗", wheels: "铝合金 20/21/22寸", mSportBodykit: "可选", adaptiveLed: true, roofRails: true, powerLiftgate: true, softCloseDoors: "可选" },
      interior: { multiFunctionSteering: true, steeringHeating: true, tripComputer: "彩色", fullLCDCluster: true, hud: true, ambientLight: "星空全景可选", iDrive: true, gestureControl: true, wirelessCharging: true, crystalShifter: true },
      seats: { material: "Vernasca真皮/Merino可选", heating: "前后排", ventilation: "前排可选", massage: "前排可选", driverMemory: true },
      media: { screen: "双联屏 12.3+14.9寸", bluetooth: true, speakers: "16-20喇叭 Harman Kardon/B&W可选", carplay: true },
      lights: { ledHeadlights: true, laserHeadlights: "可选", autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: true, welcomeLightCarpet: true },
      mirrors: { adjustment: "电动调节", heating: true, folding: "电动折叠", memory: true, autoDimming: true },
      wipers: { rainSensing: true },
      ac: { type: "四区自动空调", rearVents: true, pm25Filter: true, ionizer: true, fragrance: "可选" },
    }
  },

  // ===== 奔驰补充 =====
  {
    brand: "奔驰", model: "E级", yearRange: "2016-2025",
    manufacturer: "北京奔驰", vehicleType: "中大型车", releaseDate: "2016-01-01", energyType: "汽油/混动",
    specs: {
      engine: { model: "M264 920", intake: "涡轮增压", displacement: "2.0", layout: "L", cylinders: "4", valvesPerCylinder: "4", maxPowerKw: 190, maxPowerPs: 258, maxTorque: 370, fuelGrade: "95号", fuelSupply: "直喷", mildHybrid: "48V EQ Boost" },
      transmission: { type: "手自一体变速箱(AT)", description: "9速手自一体 9G-TRONIC", gears: 9 },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 3079, length: 5078, width: 1860, height: 1490, curbWeight: 1880 },
      chassis: { drive: "前置后驱/前置四驱(4MATIC)", frontSuspension: "多连杆式独立悬架", rearSuspension: "多连杆式独立悬架", steeringAssist: "电动助力", airSuspension: "可选" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, kneeAirbag: true, abs: true, cruiseControl: "全速自适应巡航", laneKeeping: true, autonomousBraking: true, blindSpot: true, panoramicCamera: "360", autoPark: true, preSafe: true },
      exterior: { sunroof: "分段式全景天窗可选", wheels: "铝合金 18/19/20寸", amgBodykit: "可选", multibeamLed: "可选" },
      interior: { multiFunctionSteering: true, tripComputer: "彩色", fullLCDCluster: "双12.3寸联屏", hud: "可选", ambientLight: "64色可选", mbux: true, wirelessCharging: true, touchpad: true },
      seats: { material: "ARTICO皮革/真皮可选", heating: "前后排可选", ventilation: "前排可选", massage: "可选", driverMemory: true, bossSeatButton: true, rearSunshade: "电动可选" },
      media: { screen: "双12.3寸联屏/竖版大屏", bluetooth: true, speakers: "8-13喇叭 Burmester可选", carplay: true, rearEntertainment: "可选" },
      lights: { ledHeadlights: true, multibeamLed: "几何多光束可选", autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: true, welcomeLight: true },
      mirrors: { adjustment: "电动调节", heating: true, folding: "电动折叠", memory: true, autoDimming: true, logoProjection: true },
      wipers: { rainSensing: "雨量感应式" },
      ac: { type: "双区/四区自动空调", rearVents: true, pm25Filter: true, ionizer: true, fragrance: "可选" },
    }
  },
  {
    brand: "奔驰", model: "GLC", yearRange: "2016-2025",
    manufacturer: "北京奔驰", vehicleType: "中型SUV", releaseDate: "2016-01-01", energyType: "汽油/混动",
    specs: {
      engine: { model: "M264 920", intake: "涡轮增压", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 190, maxPowerPs: 258, maxTorque: 370, fuelGrade: "95号", fuelSupply: "直喷", mildHybrid: "48V" },
      transmission: { type: "手自一体变速箱(AT)", description: "9速手自一体 9G-TRONIC", gears: 9 },
      body: { form: "SUV", doors: 5, seats: "5/7可选", wheelbase: 2973, length: 4826, width: 1890, height: 1714, curbWeight: 1995 },
      chassis: { drive: "前置四驱(4MATIC)", frontSuspension: "多连杆式", rearSuspension: "多连杆式", steeringAssist: "电动助力", airSuspension: "可选" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, kneeAirbag: true, abs: true, cruiseControl: "全速自适应巡航", laneKeeping: true, autonomousBraking: true, panoramicCamera: "360", autoPark: true, preSafe: true },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金 19/20寸", roofRails: true, powerLiftgate: true, amgBodykit: "可选" },
      interior: { multiFunctionSteering: true, tripComputer: "彩色", fullLCDCluster: true, hud: "可选", ambientLight: "64色", mbux: true, wirelessCharging: true },
      seats: { material: "ARTICO皮革/真皮可选", heating: "前后排可选", ventilation: "前排可选", driverMemory: true },
      media: { screen: "触控液晶屏 11.9寸", bluetooth: true, speakers: "8-13喇叭 Burmester可选", carplay: true },
      lights: { ledHeadlights: true, multibeamLed: "可选", autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: true },
      mirrors: { adjustment: "电动调节", heating: true, folding: "电动折叠", memory: true, autoDimming: true },
      ac: { type: "双区/四区自动空调", rearVents: true, pm25Filter: true, fragrance: "可选" },
    }
  },

  // ===== 大众补充 =====
  {
    brand: "大众", model: "途观L", yearRange: "2016-2025",
    manufacturer: "上汽大众", vehicleType: "中型SUV", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "EA888-DPL", intake: "涡轮增压", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 137, maxPowerPs: 186, maxTorque: 320, fuelGrade: "95号", fuelSupply: "直喷" },
      transmission: { type: "湿式双离合变速箱(DCT)", description: "7挡湿式双离合 DSG", gears: 7 },
      body: { form: "SUV", doors: 5, seats: "5/7", wheelbase: 2791, length: 4735, width: 1859, height: 1677, curbWeight: 1665 },
      chassis: { drive: "前置前驱/前置四驱(4MOTION)", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "自适应巡航可选", laneKeeping: "可选", autonomousBraking: "可选", rearRadar: true, panoramicCamera: "360可选" },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金 18/19寸", roofRails: true },
      interior: { multiFunctionSteering: true, tripComputer: "彩色", fullLCDCluster: true, ambientLight: "可选", wirelessCharging: "可选" },
      seats: { material: "仿皮/真皮", heating: "前排可选", driverElectric: true, rearFoldRatio: "4/6" },
      media: { screen: "触控液晶屏 8/12寸", bluetooth: true, speakers: "8-10喇叭 Harman Kardon可选", carplay: true },
      lights: { ledHeadlights: true, matrixLed: "IQ.Light可选", autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: "可选" },
      ac: { type: "三区自动空调", rearVents: true, pm25Filter: true },
    }
  },
  {
    brand: "大众", model: "帕萨特", yearRange: "2016-2025",
    manufacturer: "上汽大众", vehicleType: "中型车", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "EA888-DPL", intake: "涡轮增压", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 162, maxPowerPs: 220, maxTorque: 350, fuelGrade: "95号", fuelSupply: "直喷" },
      transmission: { type: "湿式双离合变速箱(DCT)", description: "7挡湿式双离合 DSG", gears: 7 },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2871, length: 4948, width: 1836, height: 1469, curbWeight: 1620 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "自适应巡航", laneKeeping: "可选", autonomousBraking: "可选", rearRadar: true, panoramicCamera: "360可选", autoPark: "可选" },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金 17/18寸" },
      interior: { multiFunctionSteering: true, tripComputer: "彩色", fullLCDCluster: true, ambientLight: "可选", wirelessCharging: "可选" },
      seats: { material: "仿皮/真皮", heating: "前排可选", ventilation: "可选", driverMemory: "可选", bossSeatButton: "可选" },
      media: { screen: "触控液晶屏 8/9.2寸", bluetooth: true, speakers: "8-10喇叭 Dynaudio可选", carplay: true },
      lights: { ledHeadlights: true, matrixLed: "IQ.Light可选", autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: "可选" },
      ac: { type: "三区自动空调", rearVents: true, pm25Filter: true },
    }
  },

  // ===== 保时捷 =====
  {
    brand: "保时捷", model: "Cayenne", yearRange: "2016-2025",
    manufacturer: "保时捷(进口)", vehicleType: "中大型SUV", releaseDate: "2016-01-01", energyType: "汽油/混动",
    specs: {
      engine: { model: "EA839", intake: "涡轮增压", displacement: "3.0", layout: "V", cylinders: "6", valvesPerCylinder: "4", maxPowerKw: 250, maxPowerPs: 340, maxTorque: 450, fuelGrade: "95号/98号", fuelSupply: "直喷" },
      transmission: { type: "手自一体变速箱(AT)", description: "8速Tiptronic S", gears: 8 },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2895, length: 4926, width: 1983, height: 1696, fuelTank: 90, curbWeight: 2230 },
      chassis: { drive: "前置四驱(全时四驱)", frontSuspension: "多连杆式", rearSuspension: "多连杆式", steeringAssist: "电动助力", airSuspension: true, pasm: true, pdcc: "可选", rearAxleSteering: "可选" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, kneeAirbag: true, rearSideAirbags: "可选", abs: true, cruiseControl: "自适应巡航", laneKeeping: true, autonomousBraking: true, nightVision: "可选", panoramicCamera: "360", autoPark: true },
      exterior: { sunroof: "可开启全景天窗/碳纤维可选", wheels: "铝合金 19/20/21/22寸", sportDesignPackage: "可选", powerLiftgate: true, softCloseDoors: "可选" },
      interior: { multiFunctionSteering: "真皮/碳纤维加热", steeringHeating: true, tripComputer: "彩色", fullLCDCluster: "曲面联屏", hud: "可选", sportChrono: "可选", ambientLight: "可选", analogClock: "Sport Chrono秒表可选" },
      seats: { material: "真皮/Club真皮/千鸟格可选", heating: "前后排可选", ventilation: "前排可选", massage: "前排可选", driverMemory: true, sportSeats: "14/18向可选" },
      media: { screen: "双屏 12.6+12.3寸", bluetooth: true, speakers: "10-21喇叭 Bose/Burmester可选", carplay: true, rearEntertainment: "可选", passengerScreen: "可选" },
      lights: { ledHeadlights: true, matrixLed: "PDLS Plus可选", autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: true },
      mirrors: { adjustment: "电动调节", heating: true, folding: "电动折叠", memory: true, autoDimming: true, sportDesignMirrors: "可选" },
      wipers: { rainSensing: true },
      ac: { type: "四区自动空调", rearVents: true, pm25Filter: true, ionizer: true },
    }
  },

  // ===== 蔚来 =====
  {
    brand: "蔚来", model: "ES6", yearRange: "2019-2025",
    manufacturer: "蔚来汽车", vehicleType: "中型SUV", releaseDate: "2019-06-01", energyType: "纯电动",
    specs: {
      engine: { type: "纯电动", motorPower: "360(四驱)", motorTorque: 700, batteryCapacity: "75/100/150kWh", batteryType: "三元锂/半固态可选", range: "490/625/930km", acceleration: "5.6/4.7s(0-100)", charging: "换电3分钟/快充", energyConsumption: "17.6kWh/100km", batterySwap: true },
      transmission: { type: "固定齿比变速箱", description: "单速", gears: 1 },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2915, length: 4854, width: 1995, height: 1703, curbWeight: 2380 },
      chassis: { drive: "双电机四驱", frontSuspension: "双叉臂式空气悬架", rearSuspension: "多连杆式空气悬架", steeringAssist: "电动助力", cdc: true, airSuspension: true },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "NIO Pilot全速自适应", laneKeeping: true, autonomousBraking: true, panoramicCamera: "360", nioPilot: true, nad: "可选", lidar: true },
      exterior: { panoramicRoof: "全景天幕", wheels: "铝合金 19/20/21寸", flushDoorHandles: true, roofRails: true },
      interior: { multiFunctionSteering: "真皮加热", steeringHeating: true, tripComputer: "数字仪表", fullLCDCluster: true, hud: true, nomi: true, ambientLight: "10色可选", wirelessCharging: true },
      seats: { material: "Haptex合成皮/Nappa真皮可选", heating: "前后排", ventilation: "前排", massage: "前排可选", driverMemory: true, queenSeat: true },
      media: { screen: "AMOLED中控屏 12.8寸", bluetooth: true, speakers: "23喇叭 7.1.4杜比全景声", nioOS: true, otaUpgrade: true, karaoke: true },
      lights: { ledHeadlights: true, matrixLed: "智能多光束", autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: true },
      mirrors: { adjustment: "电动调节", heating: true, folding: "电动折叠", memory: true, autoDimming: true },
      wipers: { rainSensing: true },
      ac: { type: "三区自动空调", rearVents: true, pm25Filter: true, aromaDiffuser: true },
    }
  },
  {
    brand: "蔚来", model: "ET5", yearRange: "2022-2025",
    manufacturer: "蔚来汽车", vehicleType: "中型车", releaseDate: "2022-09-01", energyType: "纯电动",
    specs: {
      engine: { type: "纯电动", motorPower: "360(四驱)", motorTorque: 700, batteryCapacity: "75/100/150kWh", batteryType: "三元锂/半固态", range: "560/710/1000km", acceleration: "4.0s(0-100)", charging: "换电3分钟", batterySwap: true },
      transmission: { type: "固定齿比变速箱", description: "单速", gears: 1 },
      body: { form: "三厢车/旅行版", doors: 4, seats: 5, wheelbase: 2888, length: 4790, width: 1960, height: 1499, curbWeight: 2280 },
      chassis: { drive: "双电机四驱", frontSuspension: "五连杆式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, centerAirbag: true, abs: true, cruiseControl: "NAD全速自适应", laneKeeping: true, autonomousBraking: true, lidar: true, panoramicCamera: "360" },
      exterior: { glassRoof: "全景天幕 1.28m2", wheels: "铝合金 19/20寸", flushDoorHandles: true, framelessWindows: true, activeRearSpoiler: true },
      interior: { multiFunctionSteering: "真皮加热", steeringHeating: true, tripComputer: "数字仪表 10.2寸", fullLCDCluster: true, hud: true, nomi: true, ambientLight: "256色可选", wirelessCharging: true },
      seats: { material: "Haptex/Nappa真皮可选", heating: "前后排", ventilation: "前排", massage: "前排可选", driverMemory: true },
      media: { screen: "AMOLED中控屏 12.8寸", bluetooth: true, speakers: "23喇叭 7.1.4杜比全景声", otaUpgrade: true, karaoke: true, arGlass: "可选" },
      lights: { ledHeadlights: true, matrixLed: "智能多光束", autoHeadlights: true, daytimeRunning: true },
      ac: { type: "双区自动空调", rearVents: true, pm25Filter: true, aromaDiffuser: true },
    }
  },

  // ===== 小鹏 =====
  {
    brand: "小鹏", model: "P7", yearRange: "2020-2025",
    manufacturer: "小鹏汽车", vehicleType: "中型车", releaseDate: "2020-06-01", energyType: "纯电动",
    specs: {
      engine: { type: "纯电动", motorPower: "196(后驱)/348(四驱)", motorTorque: "390/757", batteryCapacity: "60.2/70.8/86.2kWh", batteryType: "磷酸铁锂/三元锂", range: "480/586/706km", acceleration: "6.7/4.3s(0-100)", charging: "快充30分钟30-80%", energyConsumption: "12.5kWh/100km" },
      transmission: { type: "固定齿比变速箱", description: "单速", gears: 1 },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2998, length: 4880, width: 1896, height: 1450, curbWeight: 1890 },
      chassis: { drive: "后置后驱/双电机四驱", frontSuspension: "双叉臂式", rearSuspension: "多连杆式", steeringAssist: "电动助力", cdc: "可选", brembo: "四驱版" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "XPILOT 3.0全速自适应", laneKeeping: true, autonomousBraking: true, xpilot: true, ngp: true, lidar: "可选", panoramicCamera: "360" },
      exterior: { glassRoof: "全景玻璃车顶", wheels: "铝合金 18/19寸", flushDoorHandles: true, framelessWindows: true, poweredChargePort: true },
      interior: { multiFunctionSteering: true, steeringHeating: "可选", tripComputer: "数字仪表 10.25寸", fullLCDCluster: true, ambientLight: "多色可选", wirelessCharging: true },
      seats: { material: "Nappa真皮可选", heating: "前排可选", ventilation: "前排可选", driverMemory: true, dannaMusicSeats: "可选" },
      media: { screen: "中控屏 14.96寸", bluetooth: true, speakers: "8-18喇叭 Dynaudio可选", otaUpgrade: true, voiceControl: true, xmartOS: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: "可选", welcomeLight: true },
      ac: { type: "双区自动空调", rearVents: true, pm25Filter: true },
    }
  },
  {
    brand: "小鹏", model: "G6", yearRange: "2023-2025",
    manufacturer: "小鹏汽车", vehicleType: "中型SUV", releaseDate: "2023-06-01", energyType: "纯电动",
    specs: {
      engine: { type: "纯电动", motorPower: "218(后驱)/358(四驱)", motorTorque: "440/660", batteryCapacity: "66/87.5kWh", batteryType: "磷酸铁锂/三元锂", range: "580/700/755km", acceleration: "6.6/3.9s(0-100)", charging: "800V超快充15分钟300km", energyConsumption: "13.2kWh/100km" },
      chassis: { drive: "后置后驱/双电机四驱", frontSuspension: "双叉臂式", rearSuspension: "多连杆式" },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2890, length: 4753, width: 1920, height: 1650, curbWeight: 2090 },
      safety: { driverAirbag: true, abs: true, cruiseControl: "XNGP全速自适应", laneKeeping: true, lidar: true, panoramicCamera: "360" },
      exterior: { glassRoof: "全景天幕", wheels: "铝合金 18/20寸", flushDoorHandles: true },
      media: { screen: "中控屏 15寸", bluetooth: true, speakers: "8-18喇叭", otaUpgrade: true },
    }
  },

  // ===== 理想 =====
  {
    brand: "理想", model: "L6", yearRange: "2024-2025",
    manufacturer: "理想汽车", vehicleType: "中大型SUV", releaseDate: "2024-01-01", energyType: "增程式混动",
    specs: {
      engine: { type: "增程式混动", rangeExtender: "1.5T四缸增程器", motorPower: "300(四驱)", motorTorque: 529, batteryCapacity: "36.8kWh", fuelTank: 60, range: "总1390km(纯电212+油电1178)", acceleration: "5.4s(0-100)", fuelGrade: "92号", energyConsumption: "21.7kWh/100km(纯电)/6.9L/100km(油电)" },
      transmission: { type: "固定齿比变速箱", description: "单速", gears: 1 },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2920, length: 4925, width: 1960, height: 1735, curbWeight: 2345 },
      chassis: { drive: "双电机四驱", frontSuspension: "双叉臂式空气悬架", rearSuspension: "多连杆式空气悬架", steeringAssist: "电动助力", cdc: true, airSuspension: true },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "AD Pro/Max全速自适应", laneKeeping: true, autonomousBraking: true, lidar: "Max版", panoramicCamera: "360" },
      exterior: { glassRoof: "全景天幕电动遮阳帘", wheels: "铝合金 20/21寸", flushDoorHandles: true },
      interior: { multiFunctionSteering: "真皮加热", steeringHeating: true, tripComputer: "彩色", fullLCDCluster: "方向盘屏+AR-HUD", hud: true, ambientLight: "256色", wirelessCharging: true, refrigerator: true },
      seats: { material: "Nappa真皮", heating: "前后排", ventilation: "前后排", massage: "前后排 SPA级", driverMemory: true, queenSeat: true },
      media: { screen: "双15.7寸联屏+15.7寸后排", bluetooth: true, speakers: "19喇叭/21喇叭铂金可选 杜比全景声", gestureControl: true, dualChip: "高通8295x2", otaUpgrade: true, karaoke: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: true },
      ac: { type: "三区自动空调", rearVents: true, pm25Filter: true, ionizer: true, aromaDiffuser: true },
    }
  },

  // ===== 极氪 =====
  {
    brand: "极氪", model: "001", yearRange: "2021-2025",
    manufacturer: "极氪汽车", vehicleType: "中大型车(猎装)", releaseDate: "2021-10-01", energyType: "纯电动",
    specs: {
      engine: { type: "纯电动", motorPower: "200(后驱)/400(四驱)", motorTorque: "343/686", batteryCapacity: "86/100/140kWh", batteryType: "三元锂", range: "546/741/1032km", acceleration: "6.9/3.8/3.3s(0-100)", charging: "800V超快充15分钟500km", energyConsumption: "14.6kWh/100km" },
      transmission: { type: "固定齿比变速箱", description: "单速", gears: 1 },
      body: { form: "猎装车", doors: 5, seats: 5, wheelbase: 3005, length: 4977, width: 1999, height: 1545, curbWeight: 2350 },
      chassis: { drive: "后置后驱/双电机四驱", frontSuspension: "双叉臂式空气悬架", rearSuspension: "多连杆式空气悬架", steeringAssist: "电动助力", cdc: true, airSuspension: true },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "NZP全速自适应", laneKeeping: true, autonomousBraking: true, lidar: true, panoramicCamera: "360" },
      exterior: { panoramicRoof: "全景天幕", wheels: "铝合金 19/21/22寸", flushDoorHandles: true, framelessWindows: true, activeGrillShutters: true },
      interior: { multiFunctionSteering: "真皮电动调节", steeringHeating: true, tripComputer: "数字仪表", fullLCDCluster: "8.8+15.4寸", hud: true, ambientLight: "多色可选", wirelessCharging: true },
      seats: { material: "Nappa真皮可选", heating: "前后排", ventilation: "前排", massage: "前排可选", driverMemory: true },
      media: { screen: "触控液晶屏 15.4寸/向日葵屏", bluetooth: true, speakers: "12-28喇叭 Yamaha可选", otaUpgrade: true, voiceControl: true },
      lights: { matrixLed: "矩阵式LED", autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: true },
      ac: { type: "双区/三区自动空调", rearVents: true, pm25Filter: true, aromaDiffuser: true },
    }
  },

  // ===== 问界 =====
  {
    brand: "问界", model: "M7", yearRange: "2022-2025",
    manufacturer: "赛力斯/华为", vehicleType: "中大型SUV", releaseDate: "2022-07-01", energyType: "增程式混动/纯电",
    specs: {
      engine: { type: "增程式混动/纯电", rangeExtender: "1.5T四缸增程器", motorPower: "200(后驱)/330(四驱)", motorTorque: "360/660", batteryCapacity: "40/42kWh", range: "总1400km(纯电240+油电1160)", acceleration: "7.8/4.8s(0-100)", fuelGrade: "92号", fuelTank: 60 },
      transmission: { type: "固定齿比变速箱", description: "单速", gears: 1 },
      body: { form: "SUV", doors: 5, seats: "5/6", wheelbase: 2820, length: 5020, width: 1945, height: 1775, curbWeight: 2420 },
      chassis: { drive: "后置后驱/双电机四驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力", cdc: "可选" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "华为ADS全速自适应", laneKeeping: true, autonomousBraking: true, lidar: true, panoramicCamera: "360", autoPark: true },
      exterior: { panoramicRoof: "全景天窗电动遮阳帘", wheels: "铝合金 20/21寸", flushDoorHandles: true, powerLiftgate: true },
      interior: { multiFunctionSteering: "真皮加热", steeringHeating: true, tripComputer: "彩色", fullLCDCluster: true, hud: true, ambientLight: "128色可选", wirelessCharging: true, hongmengOS: true },
      seats: { material: "Nappa真皮", heating: "前后排", ventilation: "前后排", massage: "前后排可选", zeroGravitySeat: true, driverMemory: true },
      media: { screen: "15.6寸中控屏", bluetooth: true, speakers: "15-19喇叭 Huawei Sound可选", huaweiSound: true, otaUpgrade: true, karaoke: true, maglink: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: true, welcomeLight: true },
      ac: { type: "双区/三区自动空调", rearVents: true, pm25Filter: true, ionizer: true, aromaDiffuser: true },
    }
  },

  // ===== 哪吒/零跑 补充 =====
  {
    brand: "零跑", model: "C11", yearRange: "2021-2025",
    manufacturer: "零跑汽车", vehicleType: "中型SUV", releaseDate: "2021-09-01", energyType: "纯电动/增程",
    specs: {
      engine: { type: "纯电动/增程", motorPower: "200(后驱)/400(四驱)", motorTorque: "360/720", batteryCapacity: "69.2/89.97kWh", range: "510/610/1210km(增程)", acceleration: "7.9/4.8s(0-100)", charging: "快充" },
      chassis: { drive: "后置后驱/双电机四驱", frontSuspension: "双叉臂式", rearSuspension: "多连杆式" },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2930, length: 4780, width: 1905, height: 1675, curbWeight: 2090 },
      safety: { driverAirbag: true, abs: true, cruiseControl: "Leapmotor Pilot", laneKeeping: true, autonomousBraking: true, panoramicCamera: "360", faceRecognition: true },
      interior: { multiFunctionSteering: true, tripComputer: "三联屏", ambientLight: true },
      seats: { material: "Nappa真皮可选", heating: "前排可选", ventilation: "前排可选" },
      media: { screen: "三联屏 10.25+12.8+10.25寸", speakers: "12喇叭可选", otaUpgrade: true, faceid: true },
    }
  },

  // ===== 东风商用车 =====
  {
    brand: "东风", model: "天龙KL", yearRange: "2016-2025",
    manufacturer: "东风商用车", vehicleType: "牵引车/载货车", releaseDate: "2016-01-01", energyType: "柴油",
    specs: {
      engine: { model: "dCi450-51/DDi11", intake: "涡轮增压", displacement: "11.12", layout: "L", cylinders: "6", maxPowerKw: 343, maxPowerPs: 465, maxTorque: 2300, fuelGrade: "0号柴油", fuelSupply: "高压共轨直喷", emissionStandard: "国五/国六" },
      transmission: { type: "手动/AMT自动", description: "12挡/14挡", gears: "12/14" },
      body: { form: "牵引车", doors: 2, seats: 2, wheelbase: "3300+1350", length: 6960, width: 2500, height: 3800, curbWeight: 8800, gvw: 49000, towingCapacity: 40000 },
      chassis: { drive: "6x4", frontSuspension: "钢板弹簧", rearSuspension: "钢板弹簧/空气悬架可选", frontBrake: "鼓式/盘式可选", rearBrake: "鼓式", engineBrake: true, retarder: "可选", fuelTank: "600+400L双油箱" },
      safety: { abs: true, asr: "可选", ebp: true, laneDeparture: "可选", forwardCollision: "可选", tpms: "可选" },
      exterior: { spoiler: "可选", wheels: "钢/铝合金 12R22.5", sleeperCab: "高顶双卧" },
      interior: { multiFunctionSteering: true, tripComputer: "液晶仪表可选", ac: "自动空调", sleeperBunk: "双卧铺", storageBoxes: true },
      media: { screen: "触控屏可选", bluetooth: true, speakers: "4喇叭", fleetManagement: "可选" },
      lights: { halogenHeadlights: true, ledHeadlights: "可选", daytimeRunning: "可选" },
    }
  },

  // ===== 一汽解放 =====
  {
    brand: "一汽解放", model: "J6P", yearRange: "2016-2025",
    manufacturer: "一汽解放", vehicleType: "牵引车/载货车", releaseDate: "2016-01-01", energyType: "柴油",
    specs: {
      engine: { model: "CA6DM2/CA6DM3", intake: "涡轮增压", displacement: "11.04/12.56", layout: "L", cylinders: "6", maxPowerKw: "312-412", maxPowerPs: "420-560", maxTorque: "2100-2600", fuelGrade: "0号柴油", fuelSupply: "高压共轨直喷", emissionStandard: "国五/国六" },
      transmission: { type: "手动/AMT自动", description: "12挡/畅行版AMT", gears: 12 },
      body: { form: "牵引车", doors: 2, seats: 2, wheelbase: "3450+1350", length: 6915, width: 2500, height: 3900, curbWeight: 8900, gvw: 49000, towingCapacity: 40000 },
      chassis: { drive: "6x4", frontSuspension: "钢板弹簧", rearSuspension: "钢板弹簧", engineBrake: true, retarder: "液缓可选", fuelTank: "600+400L" },
      safety: { abs: true, asr: "可选", laneDeparture: "可选", forwardCollision: "可选" },
      exterior: { wheels: "钢/铝合金 12R22.5", sleeperCab: "高顶双卧" },
      interior: { multiFunctionSteering: true, ac: "自动空调", sleeperBunk: "双卧铺" },
      media: { screen: "触控屏可选", bluetooth: true, fleetManagement: "解放车联网可选" },
      lights: { halogenHeadlights: true, ledDaytime: "可选" },
    }
  },

  // ===== 福田商用 =====
  {
    brand: "福田", model: "欧曼GTL", yearRange: "2016-2025",
    manufacturer: "福田戴姆勒", vehicleType: "牵引车/自卸车", releaseDate: "2016-01-01", energyType: "柴油/天然气",
    specs: {
      engine: { model: "ISGe5/ISGe6/F3.8", intake: "涡轮增压", displacement: "11.8/3.8可选", layout: "L", cylinders: "6/4", maxPowerKw: "280-375", maxPowerPs: "380-510", maxTorque: "2000-2400", fuelGrade: "0号柴油/LNG", fuelSupply: "高压共轨直喷", emissionStandard: "国五/国六" },
      transmission: { type: "手动/AMT", description: "12挡/ZF TraXon可选", gears: 12 },
      body: { form: "牵引车", doors: 2, seats: 2, wheelbase: "3300+1350", length: 6950, width: 2500, height: 3880, curbWeight: 8800, gvw: 49000, towingCapacity: 40000 },
      chassis: { drive: "6x4", suspension: "钢板弹簧/空气悬架可选", engineBrake: true, retarder: "可选" },
      safety: { abs: true, asr: "可选", tpms: "可选" },
      exterior: { wheels: "铝合金可选", sleeperCab: "高顶双卧", spoiler: "可选" },
      media: { screen: "触控屏可选", bluetooth: true, fleetManagement: "福田车联网", speakers: "4喇叭" },
    }
  },

  // ===== 江铃轻卡 =====
  {
    brand: "江铃", model: "凯运", yearRange: "2016-2025",
    manufacturer: "江铃汽车", vehicleType: "轻卡", releaseDate: "2016-01-01", energyType: "柴油",
    specs: {
      engine: { model: "JX4D30A6H", intake: "涡轮增压", displacement: "2.89", layout: "L", cylinders: "4", maxPowerKw: 95, maxPowerPs: 129, maxTorque: 340, fuelGrade: "0号柴油", fuelSupply: "高压共轨直喷", emissionStandard: "国五/国六" },
      transmission: { type: "手动变速箱", description: "5挡/6挡手动", gears: "5/6" },
      body: { form: "厢式/栏板/仓栅可选", doors: 2, seats: "2/3", wheelbase: 3360, length: 5995, width: 2150, height: 3150, curbWeight: 2800, gvw: 4495, cargoVolume: "18-22立方" },
      chassis: { drive: "4x2", frontSuspension: "钢板弹簧", rearSuspension: "钢板弹簧", frontBrake: "盘式可选", rearBrake: "鼓式", fuelTank: 120 },
      safety: { abs: true, reverseRadar: "可选" },
      exterior: { cargoBox: "厢式/栏板/仓栅", rearViewCameras: "可选" },
      interior: { ac: "手动/自动空调可选", multiFunctionSteering: "可选" },
      media: { screen: "触控屏可选", bluetooth: "可选", speakers: "2-4喇叭" },
      lights: { halogenHeadlights: true, fogLights: true },
    }
  },
  {
    brand: "江铃", model: "顺达", yearRange: "2016-2025",
    manufacturer: "江铃汽车", vehicleType: "微卡/轻卡", releaseDate: "2016-01-01", energyType: "柴油/汽油",
    specs: {
      engine: { model: "JX493ZLQ5", intake: "涡轮增压", displacement: "2.77", layout: "L", cylinders: "4", maxPowerKw: 85, maxPowerPs: 116, maxTorque: 285, fuelGrade: "0号柴油", fuelSupply: "高压共轨直喷" },
      transmission: { type: "手动变速箱", description: "5挡手动", gears: 5 },
      body: { form: "微卡/栏板/厢式", doors: 2, seats: 2, wheelbase: 2490, length: 4990, width: 1880, height: 2170, curbWeight: 1950, gvw: 3500 },
      chassis: { drive: "4x2", suspension: "钢板弹簧", fuelTank: 60 },
      exterior: { cargoBox: "厢式/栏板" },
    }
  },
  {
    brand: "江铃", model: "特顺", yearRange: "2016-2024",
    manufacturer: "江铃汽车", vehicleType: "轻客", releaseDate: "2016-01-01", energyType: "柴油",
    specs: {
      engine: { model: "JX493ZLQ5", intake: "涡轮增压", displacement: "2.77", layout: "L", cylinders: "4", maxPowerKw: 85, maxPowerPs: 116, maxTorque: 285, fuelGrade: "0号柴油" },
      transmission: { type: "手动变速箱", description: "5挡手动", gears: 5 },
      body: { form: "轻客", doors: "4-5", seats: "6-15", wheelbase: "2835/3570", length: "4744/5496", width: 1974, height: "2215/2625", curbWeight: 2030, gvw: 3510 },
      chassis: { drive: "4x2", suspension: "麦弗逊式/钢板弹簧", fuelTank: 68 },
      exterior: { slidingDoor: "右侧滑门", rearDoor: "对开式" },
      interior: { ac: "前后双蒸空调可选" },
    }
  },


  // ===== 比亚迪补充 =====
  {
    brand: "比亚迪", model: "宋Plus", yearRange: "2020-2025",
    manufacturer: "比亚迪", vehicleType: "紧凑型SUV", releaseDate: "2020-09-01", energyType: "汽油/混动/纯电",
    specs: {
      engine: { model: "BYD476ZQA/DM-i", intake: "涡轮增压/混动", displacement: "1.5", layout: "L", cylinders: "4", maxPowerKw: "110(混动系统总160)", maxPowerPs: "150(混动218)", maxTorque: "300(混动350)", fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "双离合(DCT)/E-CVT", description: "7挡双离合/E-CVT", gears: "7/E-CVT" },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2765, length: 4705, width: 1890, height: 1680, curbWeight: 1790 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, abs: true, cruiseControl: "自适应巡航", laneKeeping: "可选", autonomousBraking: "可选", panoramicCamera: "360", rearRadar: true },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金 18/19寸" },
      interior: { multiFunctionSteering: true, fullLCDCluster: true, rotatingScreen: true, ambientLight: "多色" },
      seats: { material: "仿皮/真皮", heating: "前排可选", ventilation: "前排可选" },
      media: { screen: "12.8/15.6寸旋转触控屏", bluetooth: true, speakers: "6-9喇叭 Dirac可选", otaUpgrade: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true },
      ac: { type: "自动/双区自动空调", rearVents: true, pm25Filter: true },
    }
  },
  {
    brand: "比亚迪", model: "唐", yearRange: "2016-2025",
    manufacturer: "比亚迪", vehicleType: "中型SUV", releaseDate: "2016-01-01", energyType: "汽油/混动/纯电",
    specs: {
      engine: { model: "BYD487ZQA", intake: "涡轮增压", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 151, maxPowerPs: 205, maxTorque: 320, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "双离合(DCT)", description: "6挡双离合", gears: 6 },
      body: { form: "SUV", doors: 5, seats: "7", wheelbase: 2820, length: 4870, width: 1950, height: 1725, curbWeight: 2220 },
      chassis: { drive: "前置前驱/双电机四驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "自适应巡航", laneKeeping: true, autonomousBraking: true, panoramicCamera: "360" },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金 20/22寸", roofRails: true },
      interior: { multiFunctionSteering: true, fullLCDCluster: true, rotatingScreen: true, ambientLight: "31色可选" },
      seats: { material: "真皮", heating: "前后排可选", ventilation: "前排可选", thirdRowSeats: true },
      media: { screen: "15.6寸旋转触控屏", bluetooth: true, speakers: "12喇叭 Dynaudio可选", otaUpgrade: true, karaoke: true },
      lights: { ledHeadlights: true, matrixLed: "可选", autoHeadlights: true, daytimeRunning: true },
      ac: { type: "双区/三区自动空调", rearVents: true, pm25Filter: true }
    }
  },
  {
    brand: "比亚迪", model: "海鸥", yearRange: "2023-2025",
    manufacturer: "比亚迪", vehicleType: "微型车", releaseDate: "2023-04-01", energyType: "纯电动",
    specs: {
      engine: { type: "纯电动", motorPower: 55, motorTorque: 135, batteryCapacity: "30.08/38.88kWh", batteryType: "磷酸铁锂(刀片电池)", range: "305/405km", acceleration: "13.9s(0-100)", charging: "快充30分钟30-80%", energyConsumption: "9.6kWh/100km" },
      transmission: { type: "固定齿比变速箱", description: "单速", gears: 1 },
      body: { form: "微型两厢车", doors: 5, seats: "4/5", wheelbase: 2500, length: 3780, width: 1715, height: 1540, curbWeight: 1160 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "扭力梁" },
      safety: { driverAirbag: true, passengerAirbag: true, abs: true, rearRadar: "可选", rearCamera: "可选", tpms: true },
      exterior: { wheels: "钢/铝合金 15/16寸", roofRails: "可选" },
      interior: { multiFunctionSteering: true, tripComputer: "7寸液晶仪表", fullLCDCluster: "可选" },
      seats: { material: "织物/仿皮" },
      media: { screen: "10.1/12.8寸旋转触控屏可选", bluetooth: true, speakers: "2-4喇叭", otaUpgrade: "可选" },
      lights: { ledHeadlights: "可选", halogenHeadlights: true, daytimeRunning: "可选" },
      ac: { type: "手动空调/自动空调可选" },
    }
  },
  {
    brand: "比亚迪", model: "秦Plus", yearRange: "2021-2025",
    manufacturer: "比亚迪", vehicleType: "紧凑型车", releaseDate: "2021-03-01", energyType: "混动/纯电",
    specs: {
      engine: { type: "DM-i混动/纯电", engineModel: "BYD472QA", intake: "自然吸气", displacement: "1.5", layout: "L", cylinders: "4", motorPower: "132(电机)/145(电机)", motorTorque: "316/325", batteryCapacity: "8.32/18.32/57.6kWh", range: "纯电55/120/510km", acceleration: "7.9/7.3s(0-100)", fuelGrade: "92号", energyConsumption: "12kWh/100km(纯电)" },
      transmission: { type: "E-CVT/固定齿比", description: "E-CVT/单速", gears: "E-CVT/1" },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2718, length: 4765, width: 1837, height: 1495, curbWeight: 1620 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "扭力梁" },
      safety: { driverAirbag: true, frontSideAirbags: true, abs: true, cruiseControl: "定速巡航/自适应巡航可选", rearRadar: true, panoramicCamera: "360可选" },
      exterior: { sunroof: "电动天窗可选", wheels: "铝合金 16/17寸" },
      interior: { multiFunctionSteering: true, fullLCDCluster: "可选", rotatingScreen: true },
      seats: { material: "仿皮", heating: "前排可选" },
      media: { screen: "10.1/12.8寸旋转触控屏", bluetooth: true, speakers: "4-6喇叭", otaUpgrade: true },
      lights: { ledHeadlights: true, autoHeadlights: "可选", daytimeRunning: true },
      ac: { type: "自动空调可选", pm25Filter: true },
    }
  },

  // ===== 长城/坦克 =====
  {
    brand: "坦克", model: "300", yearRange: "2021-2025",
    manufacturer: "长城汽车", vehicleType: "中型越野SUV", releaseDate: "2021-01-01", energyType: "汽油/混动",
    specs: {
      engine: { model: "E20CB", intake: "涡轮增压", displacement: "2.0", layout: "L", cylinders: "4", valvesPerCylinder: "4", maxPowerKw: 167, maxPowerPs: 227, maxTorque: 387, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "手自一体变速箱(AT)", description: "8速手自一体 ZF", gears: 8 },
      body: { form: "越野SUV", doors: 5, seats: 5, wheelbase: 2750, length: 4760, width: 1930, height: 1903, fuelTank: 80, curbWeight: 2150, groundClearance: 224, approachAngle: 33, departureAngle: 34 },
      chassis: { drive: "前置四驱(分时四驱)", frontSuspension: "双叉臂式独立悬架", rearSuspension: "多连杆非独立悬架", structure: "非承载式", lowRangeGear: true, diffLock: "前后桥差速锁可选", tankTurn: true, crawlControl: true },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "自适应巡航", laneKeeping: true, autonomousBraking: true, panoramicCamera: "360", tpms: true, offroadModes: "9种全地形模式" },
      exterior: { sunroof: "电动天窗", wheels: "铝合金 17/18寸 AT胎可选", roofRails: true, spareTire: "后挂式", snorkelReady: true },
      interior: { multiFunctionSteering: "真皮加热", steeringHeating: true, tripComputer: "彩色", fullLCDCluster: true, ambientLight: "多色" },
      seats: { material: "Nappa真皮", heating: "前后排", ventilation: "前排", massage: "前排可选" },
      media: { screen: "双12.3寸联屏", bluetooth: true, speakers: "Infinity 9喇叭", carplay: true },
      lights: { ledHeadlights: true, matrixLed: true, autoHeadlights: true, daytimeRunning: true },
      ac: { type: "双区自动空调", rearVents: true, pm25Filter: true },
    }
  },
  {
    brand: "坦克", model: "500", yearRange: "2022-2025",
    manufacturer: "长城汽车", vehicleType: "中大型越野SUV", releaseDate: "2022-03-01", energyType: "汽油+48V/混动",
    specs: {
      engine: { model: "E30Z", intake: "涡轮增压", displacement: "3.0", layout: "V", cylinders: "6", maxPowerKw: 265, maxPowerPs: 360, maxTorque: 500, fuelGrade: "92号", fuelSupply: "直喷", mildHybrid: "48V" },
      transmission: { type: "手自一体变速箱(AT)", description: "9速手自一体", gears: 9 },
      body: { form: "越野SUV", doors: 5, seats: "5/7", wheelbase: 2850, length: 5078, width: 1934, height: 1905, groundClearance: 224, towingCapacity: "2500kg" },
      chassis: { drive: "前置四驱(适时四驱)", frontSuspension: "双叉臂式", rearSuspension: "多连杆非独立悬架", structure: "非承载式", diffLock: "后桥差速锁可选", airSuspension: "可选" },
      safety: { driverAirbag: true, abs: true, cruiseControl: "全速自适应巡航", laneKeeping: true, autonomousBraking: true, panoramicCamera: "360", offroadCruise: true },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金 19/20寸", roofRails: true, powerLiftgate: true },
      interior: { multiFunctionSteering: true, steeringHeating: true, fullLCDCluster: true, hud: true, ambientLight: "多色", analogClock: true },
      seats: { material: "Nappa真皮", heating: "前后排", ventilation: "前后排", massage: "前后排", driverMemory: true },
      media: { screen: "14.6寸中控屏+7寸后排控制屏", bluetooth: true, speakers: "Infinity 12喇叭", carplay: true, rearEntertainment: "可选" },
      lights: { ledHeadlights: true, matrixLed: true, autoHeadlights: true, adaptiveHighBeam: true },
      ac: { type: "三区自动空调", rearVents: true, pm25Filter: true, ionizer: true },
    }
  },

  // ===== 日产途乐 (非洲热门) =====
  {
    brand: "日产", model: "途乐", yearRange: "2016-2025",
    manufacturer: "日产(进口)", vehicleType: "全尺寸SUV", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "VK56VD", intake: "自然吸气", displacement: "5.6", layout: "V", cylinders: "8", maxPowerKw: 298, maxPowerPs: 405, maxTorque: 560, fuelGrade: "92号/95号", fuelSupply: "直喷", vvel: true },
      transmission: { type: "手自一体变速箱(AT)", description: "7速手自一体", gears: 7 },
      body: { form: "SUV", doors: 5, seats: "7/8", wheelbase: 3075, length: 5315, width: 1995, height: 1955, fuelTank: 140, groundClearance: 273, approachAngle: 34 },
      chassis: { drive: "前置四驱(全模式四驱)", frontSuspension: "双叉臂式独立悬架", rearSuspension: "双叉臂式独立悬架", structure: "非承载式", hbms: true, diffLock: "后桥差速锁", lowRangeGear: true, offroadModes: "沙地/岩石/雪地/公路" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "自适应巡航可选", laneKeeping: "可选", autonomousBraking: "可选", panoramicCamera: "360可选", tpms: true },
      exterior: { sunroof: "电动天窗", wheels: "铝合金 18/20寸", roofRails: true, sideSteps: true, spareTire: "底挂式", towHitch: "可选" },
      interior: { multiFunctionSteering: true, steeringHeating: true, tripComputer: "彩色", fullLCDCluster: "可选", refrigerator: true, rearRoofVents: true },
      seats: { material: "真皮", heating: "前后排可选", ventilation: "前排可选", thirdRowSeats: true, foldFlat: true },
      media: { screen: "双屏中控 8+7寸可选", bluetooth: true, speakers: "13喇叭 BOSE可选", rearEntertainment: "双屏可选", carplay: "可选" },
      lights: { ledHeadlights: "可选", autoHeadlights: true, daytimeRunning: true, fogLights: "LED前雾灯" },
      ac: { type: "三区自动空调", rearVents: true, rearAcControl: true },
    }
  },

  // ===== 三菱帕杰罗 (非洲最热门SUV之一) =====
  {
    brand: "三菱", model: "帕杰罗", yearRange: "2016-2024",
    manufacturer: "广汽三菱/三菱(进口)", vehicleType: "中大型越野SUV", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "6G72/6B31", intake: "自然吸气", displacement: "3.0/3.8", layout: "V", cylinders: "6", maxPowerKw: 128, maxPowerPs: 174, maxTorque: 255, fuelGrade: "92号", fuelSupply: "多点电喷", mivec: true },
      transmission: { type: "手自一体变速箱(AT)", description: "5速手自一体", gears: 5 },
      body: { form: "越野SUV", doors: 5, seats: "7", wheelbase: 2780, length: 4900, width: 1875, height: 1900, fuelTank: 88, groundClearance: 235, approachAngle: "36.6°", departureAngle: "25°" },
      chassis: { drive: "超选四驱(SS4-II)", frontSuspension: "双叉臂式独立悬架", rearSuspension: "多连杆式独立悬架", structure: "承载式(内嵌大梁)", diffLock: "后桥差速锁", lowRangeGear: true, offroadModes: "2H/4H/4HLc/4LLc" },
      safety: { driverAirbag: true, frontSideAirbags: true, abs: true, cruiseControl: "定速巡航", astc: true, hillStart: true, hillDescent: true, rearRadar: "可选" },
      exterior: { sunroof: "电动天窗", wheels: "铝合金 17/18寸", roofRails: true, sideSteps: true, spareTire: "后挂式书包", towHitch: "可选" },
      interior: { multiFunctionSteering: true, tripComputer: "彩色", fullLCDCluster: false, refrigerator: "可选", sunglassCase: true },
      seats: { material: "真皮/织物", heating: "前排可选", driverElectric: true, thirdRowSeats: true, stadiumSeating: true },
      media: { screen: "触控液晶屏 7/9寸可选", bluetooth: true, speakers: "6-12喇叭来福可选", rockfordFosgate: "可选" },
      lights: { xenonHeadlights: true, ledHeadlights: "可选", autoHeadlights: true, daytimeRunning: "可选", headlightWasher: true },
      mirrors: { adjustment: "电动调节", heating: true, folding: "可选" },
      wipers: { rainSensing: "可选" },
      ac: { type: "自动空调", rearVents: true, rearAcControl: "后排独立空调" },
    }
  },
  {
    brand: "三菱", model: "欧蓝德", yearRange: "2016-2025",
    manufacturer: "广汽三菱", vehicleType: "紧凑型SUV", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "4J12", intake: "自然吸气", displacement: "2.0/2.4", layout: "L", cylinders: "4", maxPowerKw: "122/141", maxPowerPs: "166/192", maxTorque: "201/235", fuelGrade: "92号", fuelSupply: "多点电喷", mivec: true },
      transmission: { type: "CVT无级变速", description: "CVT模拟6挡", gears: "CVT" },
      body: { form: "SUV", doors: 5, seats: "5/7", wheelbase: 2670, length: 4705, width: 1810, height: 1710, curbWeight: 1610, groundClearance: 190 },
      chassis: { drive: "前置前驱/前置四驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, kneeAirbag: true, abs: true, cruiseControl: "自适应巡航", laneKeeping: "可选", autonomousBraking: "可选", panoramicCamera: "360可选" },
      exterior: { sunroof: "电动天窗可选", wheels: "铝合金 18/20寸", roofRails: true },
      interior: { multiFunctionSteering: true, fullLCDCluster: "可选", tripComputer: "彩色" },
      seats: { material: "真皮/仿皮", heating: "前排可选", rearFoldRatio: "4/6" },
      media: { screen: "触控液晶屏 8/10.25寸", bluetooth: true, speakers: "6-8喇叭", carplay: "可选" },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true },
      mirrors: { adjustment: "电动调节", heating: true, folding: "可选" },
      ac: { type: "自动/双区自动空调", rearVents: true },
    }
  },

  // ===== 丰田 海狮 (非洲主力商用/客运) =====
  {
    brand: "丰田", model: "海狮", yearRange: "2016-2025",
    manufacturer: "丰田(进口)", vehicleType: "轻客/MPV", releaseDate: "2016-01-01", energyType: "汽油/柴油",
    specs: {
      engine: { model: "1TR-FE/2TR-FE", intake: "自然吸气", displacement: "2.0/2.7", layout: "L", cylinders: "4", maxPowerKw: "100/118", maxPowerPs: "136/160", maxTorque: "182/243", fuelGrade: "92号汽油/0号柴油", fuelSupply: "多点电喷" },
      transmission: { type: "手动/自动", description: "5速手动/4速自动", gears: "4/5" },
      body: { form: "轻客", doors: 4, seats: "10-15", wheelbase: "2570/3110", length: "4695/5380", width: 1695, height: "1980/2285", curbWeight: 1920, gvw: 3050 },
      chassis: { drive: "前置后驱", frontSuspension: "双横臂式", rearSuspension: "钢板弹簧", structure: "半承载式" },
      safety: { driverAirbag: "可选", abs: true, rearRadar: "可选" },
      exterior: { slidingDoor: "双侧可选", wheels: "钢/铝合金 15寸", rearDoor: "对开式/上掀式可选" },
      interior: { ac: "前后双蒸空调可选", seats: "织物/仿皮可选" },
      media: { screen: "触控屏可选", bluetooth: "可选", speakers: "2-4喇叭" },
      lights: { halogenHeadlights: true, fogLights: "可选" },
    }
  },

  // ===== 丰田 Coaster/考斯特 (非洲客运热门) =====
  {
    brand: "丰田", model: "柯斯达", yearRange: "2016-2025",
    manufacturer: "一汽丰田/丰田(进口)", vehicleType: "中巴/客车", releaseDate: "2016-01-01", energyType: "柴油/汽油",
    specs: {
      engine: { model: "N04C", intake: "涡轮增压", displacement: "4.0", layout: "L", cylinders: "4", maxPowerKw: 110, maxPowerPs: 150, maxTorque: 400, fuelGrade: "0号柴油", fuelSupply: "高压共轨直喷" },
      transmission: { type: "手动变速箱", description: "5挡手动", gears: 5 },
      body: { form: "中巴", doors: 3, seats: "20-30", wheelbase: 3935, length: 7005, width: 2040, height: 2630, curbWeight: 3920, gvw: 5550 },
      chassis: { drive: "前置后驱", frontSuspension: "独立悬架", rearSuspension: "钢板弹簧" },
      safety: { abs: true, driverAirbag: "可选" },
      exterior: { slidingDoor: "折叠门", largeWindows: true, rearLuggage: true },
      interior: { ac: "前后空调", seats: "织物", ceilingVents: true },
      media: { speakers: "4喇叭", microphone: true, paSystem: "可选" },
      lights: { halogenHeadlights: true, fogLights: true },
    }
  },


  // ===== 大众补充 =====
  {
    brand: "大众", model: "速腾", yearRange: "2016-2025",
    manufacturer: "一汽大众", vehicleType: "紧凑型车", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "EA211-DJS", intake: "涡轮增压", displacement: "1.4", layout: "L", cylinders: "4", maxPowerKw: 110, maxPowerPs: 150, maxTorque: 250, fuelGrade: "92号/95号", fuelSupply: "直喷" },
      transmission: { type: "干式双离合(DCT)", description: "7挡干式双离合 DSG", gears: 7 },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2736, length: 4791, width: 1801, height: 1471, curbWeight: 1410 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, abs: true, cruiseControl: "定速巡航/自适应巡航可选", rearRadar: true, laneKeeping: "可选" },
      exterior: { sunroof: "可开启全景天窗可选", wheels: "铝合金 16/18寸" },
      interior: { multiFunctionSteering: true, fullLCDCluster: "可选", tripComputer: "彩色", ambientLight: "可选" },
      seats: { material: "织物/仿皮/真皮", heating: "前排可选", driverElectric: "可选" },
      media: { screen: "触控液晶屏 8/12寸", bluetooth: true, speakers: "6-8喇叭", carplay: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true },
      ac: { type: "手动/自动/双区自动空调可选", rearVents: "可选", pm25Filter: "可选" },
    }
  },
  {
    brand: "大众", model: "迈腾", yearRange: "2016-2025",
    manufacturer: "一汽大众", vehicleType: "中型车", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "EA888-DPL", intake: "涡轮增压", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 162, maxPowerPs: 220, maxTorque: 350, fuelGrade: "95号", fuelSupply: "直喷" },
      transmission: { type: "湿式双离合(DCT)", description: "7挡湿式双离合 DSG", gears: 7 },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2871, length: 4865, width: 1832, height: 1471, curbWeight: 1575 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, kneeAirbag: true, abs: true, cruiseControl: "自适应巡航", laneKeeping: true, autonomousBraking: true, panoramicCamera: "360可选", autoPark: "可选" },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金 17/18寸" },
      interior: { multiFunctionSteering: true, steeringHeating: true, fullLCDCluster: true, ambientLight: "30色可选", analogClock: true },
      seats: { material: "真皮/Alcantara可选", heating: "前后排可选", ventilation: "前排可选", massage: "可选", driverMemory: true },
      media: { screen: "触控液晶屏 9.2寸", bluetooth: true, speakers: "8-12喇叭 Dynaudio可选", carplay: true },
      lights: { ledHeadlights: true, matrixLed: "IQ.Light可选", autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: "可选" },
      ac: { type: "三区自动空调", rearVents: true, pm25Filter: true },
    }
  },
  {
    brand: "大众", model: "探岳", yearRange: "2018-2025",
    manufacturer: "一汽大众", vehicleType: "中型SUV", releaseDate: "2018-10-01", energyType: "汽油",
    specs: {
      engine: { model: "EA888-DPL", intake: "涡轮增压", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 137, maxPowerPs: 186, maxTorque: 320, fuelGrade: "95号", fuelSupply: "直喷" },
      transmission: { type: "湿式双离合(DCT)", description: "7挡湿式双离合 DSG", gears: 7 },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2731, length: 4592, width: 1860, height: 1660, curbWeight: 1690 },
      chassis: { drive: "前置前驱/前置四驱(4MOTION)", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "自适应巡航", laneKeeping: true, autonomousBraking: true, panoramicCamera: "360可选" },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金 18/19寸", roofRails: true },
      interior: { multiFunctionSteering: true, fullLCDCluster: true, ambientLight: "可选" },
      seats: { material: "仿皮/真皮", heating: "前排可选" },
      media: { screen: "触控液晶屏 8/9.2寸", bluetooth: true, speakers: "8-10喇叭", carplay: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true },
      ac: { type: "双区独立空调", rearVents: true, pm25Filter: true },
    }
  },

  // ===== 丰田补充 =====
  {
    brand: "丰田", model: "亚洲龙", yearRange: "2019-2025",
    manufacturer: "一汽丰田", vehicleType: "中型车", releaseDate: "2019-03-01", energyType: "汽油/混动",
    specs: {
      engine: { model: "A25A-FKS", intake: "自然吸气", displacement: "2.0/2.5", layout: "L", cylinders: "4", maxPowerKw: 154, maxPowerPs: 209, maxTorque: 250, fuelGrade: "92号", fuelSupply: "混合喷射" },
      transmission: { type: "CVT/手自一体(AT)", description: "CVT/8AT", gears: "CVT/8" },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2870, length: 4990, width: 1850, height: 1450, curbWeight: 1615 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "双叉臂式", avs: "可选", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, kneeAirbag: true, abs: true, cruiseControl: "全速自适应巡航", laneKeeping: true, autonomousBraking: true, panoramicCamera: "360可选", toyotaSafetySense: true },
      exterior: { sunroof: "电动天窗/全景天窗可选", wheels: "铝合金 17/18寸" },
      interior: { multiFunctionSteering: true, fullLCDCluster: "可选", tripComputer: "彩色", hud: "可选", ambientLight: "可选" },
      seats: { material: "真皮", heating: "前排可选", ventilation: "前排可选", driverMemory: true, rearHeating: "可选", rearControlTouch: true },
      media: { screen: "触控液晶屏 9/12.3寸", bluetooth: true, speakers: "8-14喇叭 JBL可选", carplay: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: true },
      mirrors: { adjustment: "电动调节", heating: true, folding: "电动折叠", memory: true, autoDimming: true },
      ac: { type: "双区自动空调", rearVents: true, pm25Filter: true, nanoe: "可选" },
    }
  },

  // ===== 本田补充 =====
  {
    brand: "本田", model: "飞度", yearRange: "2016-2025",
    manufacturer: "广汽本田", vehicleType: "小型车", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "L15BU/L15CC", intake: "自然吸气", displacement: "1.5", layout: "L", cylinders: "4", maxPowerKw: 96, maxPowerPs: 131, maxTorque: 155, fuelGrade: "92号", fuelSupply: "直喷", earthDreams: true },
      transmission: { type: "CVT无级变速/手动", description: "CVT/5MT", gears: "CVT/5" },
      body: { form: "两厢车", doors: 5, seats: 5, wheelbase: 2530, length: 4109, width: 1694, height: 1537, curbWeight: 1137 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "扭力梁" },
      safety: { driverAirbag: true, frontSideAirbags: true, abs: true, cruiseControl: "自适应巡航可选", laneKeeping: "可选", autonomousBraking: "可选", hondaSensing: "可选" },
      exterior: { sunroof: "电动天窗可选", wheels: "钢/铝合金 15/16寸" },
      interior: { multiFunctionSteering: true, fullLCDCluster: "可选", tripComputer: "彩色" },
      seats: { material: "织物/仿皮", magicSeat: true, foldFlat: true },
      media: { screen: "触控液晶屏 7寸可选", bluetooth: true, speakers: "4-6喇叭", carplay: "可选" },
      lights: { ledHeadlights: "可选", autoHeadlights: "可选", daytimeRunning: "可选" },
      ac: { type: "手动/自动空调", pm25Filter: "可选" },
    }
  },
  {
    brand: "本田", model: "皓影", yearRange: "2019-2025",
    manufacturer: "广汽本田", vehicleType: "紧凑型SUV", releaseDate: "2019-11-01", energyType: "汽油/混动",
    specs: {
      engine: { model: "L15BT/L15BL", intake: "涡轮增压", displacement: "1.5", layout: "L", cylinders: "4", maxPowerKw: 142, maxPowerPs: 193, maxTorque: 243, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "CVT无级变速", description: "CVT", gears: "CVT" },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2661, length: 4634, width: 1855, height: 1679, curbWeight: 1560 },
      chassis: { drive: "前置前驱/前置四驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "自适应巡航", laneKeeping: true, autonomousBraking: true, hondaSensing: true, panoramicCamera: "360可选" },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金 17/19寸" },
      interior: { multiFunctionSteering: true, fullLCDCluster: "可选", tripComputer: "彩色", wirelessCharging: "可选" },
      seats: { material: "仿皮/真皮", heating: "前排可选" },
      media: { screen: "触控液晶屏 7/10.1寸", bluetooth: true, speakers: "8喇叭 BOSE可选", carplay: true, hondaConnect: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true },
      ac: { type: "自动/双区自动空调", rearVents: true, pm25Filter: true },
    }
  },
  {
    brand: "本田", model: "奥德赛", yearRange: "2016-2025",
    manufacturer: "广汽本田", vehicleType: "MPV", releaseDate: "2016-01-01", energyType: "汽油/混动",
    specs: {
      engine: { model: "LFB11(混动)", intake: "自然吸气", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 107, maxPowerPs: 146, maxTorque: 175, motorPower: 135, motorTorque: 315, systemPower: 158, fuelGrade: "92号", fuelSupply: "多点电喷" },
      transmission: { type: "E-CVT", description: "电子无级变速 E-CVT", gears: "E-CVT" },
      body: { form: "MPV", doors: 5, seats: "7", wheelbase: 2900, length: 4861, width: 1820, height: 1712, curbWeight: 1862, groundClearance: 132 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "扭力梁" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "自适应巡航", laneKeeping: true, autonomousBraking: true, hondaSensing: true, panoramicCamera: "360" },
      exterior: { sunroof: "电动天窗", wheels: "铝合金 17/18寸", slidingDoors: "双侧电动滑门", powerLiftgate: true, magicEntry: "手势感应滑门" },
      interior: { multiFunctionSteering: true, fullLCDCluster: "可选", tripComputer: "彩色", ambientLight: "可选" },
      seats: { material: "真皮", heating: "前排可选", captainSeats: "二排航空座椅", thirdRowMagic: "钓鱼模式/翻转收纳" },
      media: { screen: "触控液晶屏 10.1寸", bluetooth: true, speakers: "6-8喇叭", hondaConnect: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true },
      ac: { type: "三区自动空调", rearVents: true, pm25Filter: true },
    }
  },

  // ===== 日产补充 =====
  {
    brand: "日产", model: "逍客", yearRange: "2016-2025",
    manufacturer: "东风日产", vehicleType: "紧凑型SUV", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "MR20DD", intake: "自然吸气", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 111, maxPowerPs: 151, maxTorque: 194, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "CVT无级变速", description: "CVT模拟7挡", gears: "CVT" },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2646, length: 4401, width: 1837, height: 1593, curbWeight: 1444 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "定速巡航", laneKeeping: "可选", autonomousBraking: "可选", panoramicCamera: "360可选" },
      exterior: { sunroof: "可开启全景天窗可选", wheels: "铝合金 17/19寸" },
      interior: { multiFunctionSteering: true, fullLCDCluster: "可选", tripComputer: "彩色" },
      seats: { material: "织物/仿皮/真皮", heating: "前排可选" },
      media: { screen: "触控液晶屏 9寸", bluetooth: true, speakers: "4-8喇叭", carplay: "可选" },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true },
      ac: { type: "手动/自动空调", rearVents: true },
    }
  },
  {
    brand: "日产", model: "天籁", yearRange: "2016-2025",
    manufacturer: "东风日产", vehicleType: "中型车", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "MR20DD/KR20DDET", intake: "自然吸气/涡轮增压", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: "115/179", maxPowerPs: "156/243", maxTorque: "197/371", fuelGrade: "92号/95号", fuelSupply: "直喷", vcTurbo: true },
      transmission: { type: "CVT无级变速", description: "CVT模拟8挡", gears: "CVT" },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2825, length: 4906, width: 1850, height: 1450, curbWeight: 1511 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "自适应巡航", laneKeeping: true, autonomousBraking: true, panoramicCamera: "360可选", nissanSafetyShield: true },
      exterior: { sunroof: "分段式全景天窗可选", wheels: "铝合金 16/19寸" },
      interior: { multiFunctionSteering: true, fullLCDCluster: "可选", tripComputer: "彩色", hud: "可选" },
      seats: { material: "真皮/Zero Gravity零重力", heating: "前排可选", ventilation: "可选", massage: "可选" },
      media: { screen: "触控液晶屏 8/12.3寸", bluetooth: true, speakers: "6-9喇叭 BOSE可选", carplay: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true },
      ac: { type: "双区自动空调", rearVents: true, pm25Filter: true },
    }
  },


  // ===== 捷途 (非洲热门新势力) =====
  {
    brand: "捷途", model: "X70", yearRange: "2018-2025",
    manufacturer: "奇瑞控股·捷途", vehicleType: "中型SUV", releaseDate: "2018-08-01", energyType: "汽油",
    specs: {
      engine: { model: "SQRE4T15C", intake: "涡轮增压", displacement: "1.5", layout: "L", cylinders: "4", maxPowerKw: 115, maxPowerPs: 156, maxTorque: 230, fuelGrade: "92号", fuelSupply: "多点电喷" },
      transmission: { type: "双离合(DCT)/手动", description: "6挡双离合/6挡手动", gears: 6 },
      body: { form: "SUV", doors: 5, seats: "5/6/7", wheelbase: 2745, length: 4749, width: 1900, height: 1720, curbWeight: 1560, groundClearance: 210 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, abs: true, cruiseControl: "定速巡航/自适应巡航可选", rearRadar: true, panoramicCamera: "360可选", tpms: true },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金 18/20寸", roofRails: true },
      interior: { multiFunctionSteering: true, fullLCDCluster: true, ambientLight: "可选" },
      seats: { material: "仿皮", heating: "前排可选", thirdRowSeats: "可选" },
      media: { screen: "双10.25寸联屏", bluetooth: true, speakers: "6-8喇叭", carplay: "可选" },
      lights: { ledHeadlights: true, autoHeadlights: "可选", daytimeRunning: true },
      ac: { type: "自动/双区自动空调可选", rearVents: true, pm25Filter: true },
    }
  },
  {
    brand: "捷途", model: "旅行者", yearRange: "2023-2025",
    manufacturer: "奇瑞控股·捷途", vehicleType: "紧凑型越野SUV", releaseDate: "2023-09-01", energyType: "汽油",
    specs: {
      engine: { model: "SQRF4J20", intake: "涡轮增压", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 187, maxPowerPs: 254, maxTorque: 390, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "手自一体(AT)/双离合(DCT)", description: "8AT/7DCT", gears: "7/8" },
      body: { form: "越野SUV", doors: 5, seats: 5, wheelbase: 2800, length: 4785, width: 2006, height: 1880, groundClearance: 220, approachAngle: 28, departureAngle: 28 },
      chassis: { drive: "前置四驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", diffLock: "后桥差速锁可选", driveModes: "7种地形模式" },
      safety: { driverAirbag: true, frontSideAirbags: true, abs: true, cruiseControl: "自适应巡航", laneKeeping: true, panoramicCamera: "540透明底盘", autoPark: true },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金 19/20寸 AT胎", roofRails: true, snorkel: "可选", spareTire: "后备箱/后挂式可选" },
      interior: { multiFunctionSteering: true, fullLCDCluster: true, ambientLight: "多色" },
      seats: { material: "仿皮/真皮", heating: "前排可选", ventilation: "前排可选" },
      media: { screen: "15.6寸中控屏", bluetooth: true, speakers: "8-12喇叭 SONY可选", carplay: true },
      lights: { ledHeadlights: true, matrixLed: true, autoHeadlights: true, daytimeRunning: true },
      ac: { type: "双区自动空调", rearVents: true, pm25Filter: true },
    }
  },

  // ===== 奔腾 =====
  {
    brand: "奔腾", model: "B70", yearRange: "2016-2025",
    manufacturer: "一汽奔腾", vehicleType: "中型车", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "CA4GB15TD-30", intake: "涡轮增压", displacement: "1.5", layout: "L", cylinders: "4", maxPowerKw: 124, maxPowerPs: 169, maxTorque: 258, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "湿式双离合(DCT)", description: "7挡湿式双离合", gears: 7 },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2800, length: 4810, width: 1840, height: 1455, curbWeight: 1480 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式" },
      safety: { driverAirbag: true, frontSideAirbags: true, abs: true, cruiseControl: "定速巡航", rearRadar: true },
      exterior: { sunroof: "电动天窗可选", wheels: "铝合金 18寸", hiddenDoorHandles: true },
      interior: { multiFunctionSteering: true, fullLCDCluster: true, ambientLight: "可选" },
      seats: { material: "仿皮" },
      media: { screen: "双联屏 12.3+12.3寸", bluetooth: true, speakers: "6-8喇叭" },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true },
      ac: { type: "自动空调", rearVents: true },
    }
  },
  {
    brand: "奔腾", model: "T77", yearRange: "2018-2025",
    manufacturer: "一汽奔腾", vehicleType: "紧凑型SUV", releaseDate: "2018-11-01", energyType: "汽油",
    specs: {
      engine: { model: "CA4GA12TD", intake: "涡轮增压", displacement: "1.2", layout: "L", cylinders: "4", maxPowerKw: 105, maxPowerPs: 143, maxTorque: 204, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "双离合(DCT)/手动", description: "7挡双离合/6挡手动", gears: "6/7" },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2700, length: 4525, width: 1845, height: 1615, curbWeight: 1485 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "扭力梁" },
      safety: { driverAirbag: true, abs: true, cruiseControl: "定速巡航", rearRadar: true, panoramicCamera: "360可选" },
      exterior: { sunroof: "可开启全景天窗可选", wheels: "铝合金 19寸" },
      interior: { multiFunctionSteering: true, fullLCDCluster: true, ambientLight: "可选", holographicAssistant: true },
      seats: { material: "仿皮", heating: "前排可选" },
      media: { screen: "双12.3寸联屏", bluetooth: true, speakers: "6-8喇叭", hologram: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true },
      ac: { type: "自动空调可选", pm25Filter: true },
    }
  },

  // ===== 名爵 =====
  {
    brand: "名爵", model: "MG5", yearRange: "2020-2025",
    manufacturer: "上汽名爵", vehicleType: "紧凑型车", releaseDate: "2020-11-01", energyType: "汽油",
    specs: {
      engine: { model: "15C4E", intake: "涡轮增压", displacement: "1.5", layout: "L", cylinders: "4", maxPowerKw: 127, maxPowerPs: 173, maxTorque: 275, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "湿式双离合(DCT)/手动/CVT", description: "7DCT/5MT/CVT", gears: "5/7/CVT" },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2680, length: 4675, width: 1842, height: 1473, curbWeight: 1318 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "变截面扭力梁", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, abs: true, cruiseControl: "定速巡航/自适应巡航可选", rearRadar: true, panoramicCamera: "360可选" },
      exterior: { sunroof: "电动天窗可选", wheels: "铝合金 16/17寸", sportBodykit: true },
      interior: { multiFunctionSteering: true, fullLCDCluster: "可选", sportSeats: true },
      seats: { material: "织物/仿皮" },
      media: { screen: "触控液晶屏 10.25寸", bluetooth: true, speakers: "6喇叭 Yamaha可选", carplay: true },
      lights: { ledHeadlights: true, autoHeadlights: "可选", daytimeRunning: true },
      ac: { type: "手动/自动空调", rearVents: true, pm25Filter: "可选" },
    }
  },
  {
    brand: "名爵", model: "ZS", yearRange: "2016-2025",
    manufacturer: "上汽名爵", vehicleType: "小型SUV", releaseDate: "2016-01-01", energyType: "汽油/纯电",
    specs: {
      engine: { model: "15S4C", intake: "自然吸气", displacement: "1.5", layout: "L", cylinders: "4", maxPowerKw: 88, maxPowerPs: 120, maxTorque: 150, fuelGrade: "92号", fuelSupply: "多点电喷" },
      transmission: { type: "CVT/手动", description: "CVT/5MT", gears: "CVT/5" },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2585, length: 4314, width: 1809, height: 1648, curbWeight: 1290 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "扭力梁" },
      safety: { driverAirbag: true, abs: true, cruiseControl: "定速巡航可选", rearRadar: "可选" },
      exterior: { sunroof: "电动天窗可选", wheels: "铝合金 17寸", roofRails: true },
      interior: { multiFunctionSteering: true, fullLCDCluster: "可选" },
      seats: { material: "织物/仿皮" },
      media: { screen: "触控液晶屏 8/10.1寸可选", bluetooth: true, speakers: "4-6喇叭", carplay: "可选" },
      lights: { ledHeadlights: "可选", daytimeRunning: true },
      ac: { type: "手动/自动空调可选", pm25Filter: "可选" },
    }
  },

  // ===== 领克 =====
  {
    brand: "领克", model: "01", yearRange: "2017-2025",
    manufacturer: "领克汽车", vehicleType: "紧凑型SUV", releaseDate: "2017-11-01", energyType: "汽油/混动",
    specs: {
      engine: { model: "JLH-4G20TD", intake: "涡轮增压", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 187, maxPowerPs: 254, maxTorque: 350, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "手自一体(AT)", description: "8速手自一体 Aisin", gears: 8 },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2734, length: 4549, width: 1860, height: 1689, curbWeight: 1710 },
      chassis: { drive: "前置前驱/前置四驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "自适应巡航", laneKeeping: true, autonomousBraking: true, panoramicCamera: "360", autoPark: true },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金 19/20寸", dualExhaust: true },
      interior: { multiFunctionSteering: true, fullLCDCluster: true, ambientLight: "多色可选", wirelessCharging: true },
      seats: { material: "真皮/Alcantara混搭", heating: "前排可选", ventilation: "前排可选", driverMemory: true },
      media: { screen: "触控液晶屏 12.8寸", bluetooth: true, speakers: "Infinity 10喇叭可选", carplay: true, otaUpgrade: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: true },
      ac: { type: "双区自动空调", rearVents: true, pm25Filter: true },
    }
  },

  // ===== 长安 逸动 =====
  {
    brand: "长安", model: "逸动", yearRange: "2016-2025",
    manufacturer: "长安汽车", vehicleType: "紧凑型车", releaseDate: "2016-01-01", energyType: "汽油/纯电",
    specs: {
      engine: { model: "JL476ZQCF", intake: "涡轮增压", displacement: "1.4", layout: "L", cylinders: "4", maxPowerKw: 118, maxPowerPs: 160, maxTorque: 260, fuelGrade: "92号", fuelSupply: "直喷", blueCore: true },
      transmission: { type: "湿式双离合(DCT)", description: "7挡湿式双离合", gears: 7 },
      body: { form: "三厢车", doors: 4, seats: 5, wheelbase: 2700, length: 4730, width: 1820, height: 1505, curbWeight: 1340 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "扭力梁", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "自适应巡航可选", laneKeeping: "可选", rearRadar: true, panoramicCamera: "540°" },
      exterior: { sunroof: "电动天窗/全景天窗可选", wheels: "铝合金 16/17寸" },
      interior: { multiFunctionSteering: true, fullLCDCluster: true, ambientLight: "可选" },
      seats: { material: "仿皮", heating: "前排可选" },
      media: { screen: "双联屏 10.25+10.25寸", bluetooth: true, speakers: "6-8喇叭", otaUpgrade: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true },
      ac: { type: "自动空调可选", rearVents: true, pm25Filter: true },
    }
  },

  // ===== 星途 =====
  {
    brand: "星途", model: "揽月", yearRange: "2021-2025",
    manufacturer: "奇瑞·星途", vehicleType: "中大型SUV", releaseDate: "2021-03-01", energyType: "汽油",
    specs: {
      engine: { model: "SQRF4J20C", intake: "涡轮增压", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 192, maxPowerPs: 261, maxTorque: 400, fuelGrade: "92号", fuelSupply: "直喷" },
      transmission: { type: "手自一体(AT)", description: "8速手自一体", gears: 8 },
      body: { form: "SUV", doors: 5, seats: "7", wheelbase: 2900, length: 4970, width: 1940, height: 1795, curbWeight: 1870 },
      chassis: { drive: "前置前驱/前置四驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式" },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "全速自适应巡航", laneKeeping: true, autonomousBraking: true, panoramicCamera: "360", lidar: true },
      exterior: { sunroof: "可开启全景天窗", wheels: "铝合金 20寸", flushDoorHandles: true },
      interior: { multiFunctionSteering: true, fullLCDCluster: true, hud: true, ambientLight: "64色可选", wirelessCharging: true },
      seats: { material: "Nappa真皮", heating: "前后排", ventilation: "前后排", massage: "前排可选", thirdRowSeats: true },
      media: { screen: "三联屏 12.3+15.6+12.3寸", bluetooth: true, speakers: "12-23喇叭 SONY/Lion可选", otaUpgrade: true, karaoke: true },
      lights: { ledHeadlights: true, matrixLed: true, autoHeadlights: true, daytimeRunning: true },
      ac: { type: "三区自动空调", rearVents: true, pm25Filter: true, ionizer: true, aromaDiffuser: true },
    }
  },


  // ===== 长城皮卡 =====
  {
    brand: "长城", model: "炮", yearRange: "2019-2025",
    manufacturer: "长城汽车", vehicleType: "皮卡", releaseDate: "2019-08-01", energyType: "汽油/柴油",
    specs: {
      engine: { model: "GW4C20B", intake: "涡轮增压", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 145, maxPowerPs: 197, maxTorque: 360, fuelGrade: "92号/0号柴油", fuelSupply: "直喷" },
      transmission: { type: "手自一体(AT)/手动", description: "8速手自一体 ZF/6速手动", gears: "6/8" },
      body: { form: "皮卡", doors: 4, seats: 5, wheelbase: 3230, length: 5410, width: 1934, height: 1886, cargoBox: "1520x1520x538", curbWeight: 2045, towingCapacity: "2500kg", wadingDepth: 500 },
      chassis: { drive: "前置后驱/前置四驱", frontSuspension: "双叉臂式", rearSuspension: "多连杆整体桥/钢板弹簧", diffLock: "后桥差速锁可选", lowRangeGear: true },
      safety: { driverAirbag: true, frontSideAirbags: true, abs: true, cruiseControl: "自适应巡航可选", laneKeeping: "可选", panoramicCamera: "360可选", hillDescent: true, hillAssist: true },
      exterior: { sunroof: "电动天窗可选", wheels: "铝合金 18寸", roofRails: true, rollBar: "可选", bedLiner: "可选", snorkelReady: true },
      interior: { multiFunctionSteering: true, fullLCDCluster: true, ambientLight: "可选" },
      seats: { material: "仿皮/真皮", heating: "前排可选", driverElectric: true },
      media: { screen: "触控液晶屏 9寸", bluetooth: true, speakers: "6喇叭", carplay: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true },
      ac: { type: "自动空调", rearVents: true, pm25Filter: true },
    }
  },

  // ===== 江淮皮卡 =====
  {
    brand: "江淮", model: "T8", yearRange: "2018-2025",
    manufacturer: "江淮汽车", vehicleType: "皮卡", releaseDate: "2018-01-01", energyType: "柴油",
    specs: {
      engine: { model: "HFC4DB2-1D", intake: "涡轮增压", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 110, maxPowerPs: 150, maxTorque: 360, fuelGrade: "0号柴油", fuelSupply: "高压共轨直喷" },
      transmission: { type: "手动/自动", description: "6速手动/6速自动", gears: 6 },
      body: { form: "皮卡", doors: 4, seats: 5, wheelbase: 3380, length: 5615, width: 1880, height: 1830, cargoBox: "1810x1520x470", curbWeight: 1995, payload: "约900kg", groundClearance: 220 },
      chassis: { drive: "前置后驱/前置四驱", frontSuspension: "双横臂式螺旋弹簧", rearSuspension: "钢板弹簧", diffLock: "后桥差速锁可选" },
      safety: { driverAirbag: true, abs: true, reverseRadar: true, hillAssist: "可选", tpms: "可选" },
      exterior: { wheels: "铝合金 16/17寸", sideSteps: true, bedLiner: "可选" },
      interior: { multiFunctionSteering: true, tripComputer: true, ac: "自动空调可选" },
      seats: { material: "织物/仿皮" },
      media: { screen: "触控液晶屏 8寸可选", bluetooth: true, speakers: "4-6喇叭", rearCamera: "可选" },
      lights: { halogenHeadlights: true, ledDaytime: "可选", fogLights: true },
    }
  },
  {
    brand: "江淮", model: "悍途", yearRange: "2021-2025",
    manufacturer: "江淮汽车", vehicleType: "皮卡", releaseDate: "2021-01-01", energyType: "柴油",
    specs: {
      engine: { model: "HFC4DB2-2E", intake: "涡轮增压", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 125, maxPowerPs: 170, maxTorque: 410, fuelGrade: "0号柴油", fuelSupply: "高压共轨直喷" },
      transmission: { type: "手自一体(AT)/手动", description: "8AT/6MT", gears: "6/8" },
      body: { form: "皮卡", doors: 4, seats: 5, wheelbase: 3400, length: 5620, width: 1965, height: 1920, cargoBox: "1810x1590x470", curbWeight: 2100, groundClearance: 230 },
      chassis: { drive: "前置后驱/前置四驱", frontSuspension: "双横臂式", rearSuspension: "钢板弹簧/多连杆可选", diffLock: "后桥差速锁" },
      safety: { driverAirbag: true, frontSideAirbags: true, abs: true, cruiseControl: "定速巡航", panoramicCamera: "360可选", hillDescent: true },
      exterior: { wheels: "铝合金 18寸越野胎", rollBar: true, bedLiner: "喷涂货箱宝", snorkelReady: true, towHitch: "可选" },
      interior: { multiFunctionSteering: true, fullLCDCluster: true, ambientLight: "可选", ac: "自动双区空调" },
      seats: { material: "仿皮/真皮", heating: "前排可选", driverElectric: true },
      media: { screen: "竖版触控液晶屏 10.4寸", bluetooth: true, speakers: "6喇叭", carplay: "可选" },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true },
    }
  },

  // ===== 福田皮卡 =====
  {
    brand: "福田", model: "大将军G9", yearRange: "2021-2025",
    manufacturer: "福田汽车", vehicleType: "皮卡", releaseDate: "2021-03-01", energyType: "柴油/汽油",
    specs: {
      engine: { model: "欧康4F20TC", intake: "涡轮增压", displacement: "2.0", layout: "L", cylinders: "4", maxPowerKw: 120, maxPowerPs: 163, maxTorque: 390, fuelGrade: "0号柴油", fuelSupply: "高压共轨直喷" },
      transmission: { type: "手自一体(AT)/手动", description: "8AT ZF/6MT", gears: "6/8" },
      body: { form: "皮卡", doors: 4, seats: 5, wheelbase: 3400, length: 5630, width: 1940, height: 1870, cargoBox: "1805x1580x440", curbWeight: 2050, towingCapacity: "3000kg" },
      chassis: { drive: "前置后驱/前置四驱(borgwarner)", frontSuspension: "双叉臂式", rearSuspension: "钢板弹簧", diffLock: "后桥差速锁可选", lowRangeGear: true },
      safety: { driverAirbag: true, abs: true, cruiseControl: "定速巡航可选", rearRadar: true, autonomousBraking: "可选", laneKeeping: "可选", tpms: true },
      exterior: { wheels: "铝合金 18寸", rollBar: true, sideSteps: true, bedLiner: true, towHitch: "可选" },
      interior: { multiFunctionSteering: true, fullLCDCluster: "可选", ambientLight: "可选" },
      seats: { material: "仿皮/真皮", heating: "前排可选", driverElectric: true },
      media: { screen: "触控液晶屏 10.25寸", bluetooth: true, speakers: "6-8喇叭", carplay: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true, fogLights: "LED" },
      ac: { type: "自动空调", rearVents: true },
    }
  },

  // ===== 宇通客车 =====
  {
    brand: "宇通", model: "ZK6122H", yearRange: "2016-2025",
    manufacturer: "宇通客车", vehicleType: "大型客车", releaseDate: "2016-01-01", energyType: "柴油",
    specs: {
      engine: { model: "YC6L330-50", intake: "涡轮增压", displacement: "8.4", layout: "L", cylinders: "6", maxPowerKw: 243, maxPowerPs: 330, maxTorque: 1280, fuelGrade: "0号柴油", fuelSupply: "高压共轨", emissionStandard: "国五/国六" },
      transmission: { type: "手动/自动", description: "6挡手动/6AT可选", gears: 6 },
      body: { form: "大型客车", doors: 2, seats: "45-55", wheelbase: 6150, length: 12000, width: 2550, height: "3560/3780", curbWeight: 13700, gvw: 18000 },
      chassis: { drive: "4x2后驱", frontSuspension: "空气悬架/钢板弹簧可选", rearSuspension: "空气悬架/钢板弹簧可选", frontBrake: "盘式", rearBrake: "鼓式", retarder: "电涡流缓速器可选", fuelTank: 400 },
      safety: { abs: true, asr: "可选", tpms: true, fireExtinguisher: true, emergencyHammer: true, laneDeparture: "可选" },
      exterior: { luggageCompartment: "贯通式 8-10m3", sunShadeBlinds: true, panoramicWindows: true },
      interior: { ac: "顶置非独立空调", heater: "水暖+除霜器", seats: "高靠背可调", ceilingVents: true, readingLights: true, luggageRack: true },
      media: { screen: "19寸液晶显示器可选", dvd: "可选", paSystem: true, microphone: true, speakers: "4-6喇叭" },
      lights: { halogenHeadlights: true, ledHeadlights: "可选", fogLights: true },
    }
  },

  // ===== 重汽 =====
  {
    brand: "中国重汽", model: "豪沃T7H", yearRange: "2016-2025",
    manufacturer: "中国重汽", vehicleType: "牵引车", releaseDate: "2016-01-01", energyType: "柴油/天然气",
    specs: {
      engine: { model: "MC13.48-50", intake: "涡轮增压", displacement: "12.419", layout: "L", cylinders: "6", maxPowerKw: 353, maxPowerPs: 480, maxTorque: 2400, fuelGrade: "0号柴油", fuelSupply: "高压共轨", emissionStandard: "国五/国六" },
      transmission: { type: "手动/AMT", description: "12挡/ZF自动挡", gears: 12 },
      body: { form: "牵引车", doors: 2, seats: 2, wheelbase: "3200+1400", length: 6850, width: 2500, height: 3930, curbWeight: 8800, gvw: 49000, towingCapacity: 40000 },
      chassis: { drive: "6x4", frontSuspension: "钢板弹簧", rearSuspension: "钢板弹簧/空气悬架可选", engineBrake: true, retarder: "液缓可选", fuelTank: "600+400L", frame: "高强度双层车架" },
      safety: { abs: true, asr: true, esc: "可选", laneDeparture: "可选", forwardCollision: "可选", tpms: "可选", fatigueWarning: "可选", driveRecorder: true },
      exterior: { sleeperCab: "高顶双卧", spoiler: "可选", wheels: "铝合金 12R22.5" },
      interior: { multiFunctionSteering: true, ac: "自动空调", sleeperBunk: "双卧铺 宽800mm", storageBoxes: true, inverter: "可选" },
      media: { screen: "触控屏可选", bluetooth: true, speakers: "4喇叭", fleetManagement: "重汽车联网" },
      lights: { halogenHeadlights: true, ledDaytime: "可选", fogLights: true },
    }
  },
  {
    brand: "中国重汽", model: "豪沃轻卡", yearRange: "2016-2025",
    manufacturer: "中国重汽", vehicleType: "轻卡", releaseDate: "2016-01-01", energyType: "柴油",
    specs: {
      engine: { model: "WP2.3NQ130E61", intake: "涡轮增压", displacement: "2.29", layout: "L", cylinders: "4", maxPowerKw: 96, maxPowerPs: 130, maxTorque: 380, fuelGrade: "0号柴油", fuelSupply: "高压共轨" },
      transmission: { type: "手动", description: "6挡手动", gears: 6 },
      body: { form: "轻卡", doors: 2, seats: 3, wheelbase: 3360, length: 5995, width: 2220, height: 3200, curbWeight: 2800, gvw: 4495, cargoVolume: "约22m3" },
      chassis: { drive: "4x2", frontSuspension: "钢板弹簧", rearSuspension: "钢板弹簧", fuelTank: 120 },
      safety: { abs: true, reverseRadar: "可选", driveRecorder: "可选" },
      exterior: { cargoBox: "厢式/栏板/仓栅可选", rearCameras: "可选" },
      interior: { ac: "手动空调", multiFunctionSteering: "可选" },
      media: { screen: "触控屏可选", bluetooth: "可选", speakers: "2喇叭" },
      lights: { halogenHeadlights: true, fogLights: "可选" },
    }
  },

  // ===== 宝骏 (非洲小型车市场) =====
  {
    brand: "宝骏", model: "530", yearRange: "2018-2024",
    manufacturer: "上汽通用五菱", vehicleType: "紧凑型SUV", releaseDate: "2018-03-01", energyType: "汽油",
    specs: {
      engine: { model: "L2B", intake: "自然吸气", displacement: "1.5", layout: "L", cylinders: "4", maxPowerKw: 77, maxPowerPs: 105, maxTorque: 135, fuelGrade: "92号", fuelSupply: "多点电喷" },
      transmission: { type: "CVT/手动", description: "CVT模拟8挡/6MT", gears: "CVT/6" },
      body: { form: "SUV", doors: 5, seats: "5/7", wheelbase: 2750, length: 4695, width: 1835, height: 1750, curbWeight: 1460 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "扭力梁" },
      safety: { driverAirbag: true, abs: true, cruiseControl: "定速巡航可选", rearRadar: "可选" },
      exterior: { wheels: "铝合金 17寸", roofRails: true, sunroof: "电动天窗可选" },
      interior: { multiFunctionSteering: true, tripComputer: true },
      seats: { material: "织物/仿皮", thirdRowSeats: "可选" },
      media: { screen: "触控液晶屏 8/10.4寸可选", bluetooth: true, speakers: "4-6喇叭", carplay: "可选" },
      lights: { ledHeadlights: "可选", daytimeRunning: "可选", fogLights: "可选" },
      ac: { type: "手动/自动空调可选", rearVents: true },
    }
  },
  {
    brand: "宝骏", model: "730", yearRange: "2016-2023",
    manufacturer: "上汽通用五菱", vehicleType: "MPV", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "L2B", intake: "自然吸气", displacement: "1.5", layout: "L", cylinders: "4", maxPowerKw: 77, maxPowerPs: 105, maxTorque: 135, fuelGrade: "92号", fuelSupply: "多点电喷" },
      transmission: { type: "CVT/手动", description: "CVT/6MT", gears: "CVT/6" },
      body: { form: "MPV", doors: 5, seats: "7", wheelbase: 2750, length: 4780, width: 1780, height: 1740, curbWeight: 1500 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "扭力梁" },
      safety: { driverAirbag: true, abs: true, cruiseControl: "定速巡航可选", rearRadar: true },
      exterior: { wheels: "铝合金 16寸", roofRails: true, sunroof: "电动天窗可选" },
      interior: { multiFunctionSteering: true, fullLCDCluster: "可选" },
      seats: { material: "仿皮", thirdRowSeats: true, foldFlat: true },
      media: { screen: "触控液晶屏 8寸可选", bluetooth: true, speakers: "4-6喇叭" },
      lights: { ledHeadlights: "可选", fogLights: true },
      ac: { type: "手动/自动空调可选", rearVents: "后排空调出风口" },
    }
  },

  // ===== 东风风行 =====
  {
    brand: "东风风行", model: "T5 EVO", yearRange: "2020-2025",
    manufacturer: "东风风行", vehicleType: "紧凑型SUV", releaseDate: "2020-12-01", energyType: "汽油",
    specs: {
      engine: { model: "4A95TD", intake: "涡轮增压", displacement: "1.5", layout: "L", cylinders: "4", maxPowerKw: 145, maxPowerPs: 197, maxTorque: 285, fuelGrade: "92号", fuelSupply: "直喷", mitsubishiTech: true },
      transmission: { type: "湿式双离合(DCT)", description: "7挡湿式双离合 麦格纳", gears: 7 },
      body: { form: "SUV", doors: 5, seats: 5, wheelbase: 2715, length: 4565, width: 1860, height: 1690, curbWeight: 1550 },
      chassis: { drive: "前置前驱", frontSuspension: "麦弗逊式", rearSuspension: "多连杆式", steeringAssist: "电动助力" },
      safety: { driverAirbag: true, frontSideAirbags: true, abs: true, cruiseControl: "自适应巡航可选", laneKeeping: "可选", autonomousBraking: "可选", panoramicCamera: "360可选", tpms: true },
      exterior: { sunroof: "电动天窗/全景天窗可选", wheels: "铝合金 18/19寸", sportBodykit: true },
      interior: { multiFunctionSteering: true, fullLCDCluster: true, ambientLight: "64色可选", wirelessCharging: true },
      seats: { material: "仿皮/真皮可选", heating: "前排可选" },
      media: { screen: "双联屏 10.25+12.3寸", bluetooth: true, speakers: "6-8喇叭", carplay: true, otaUpgrade: true },
      lights: { ledHeadlights: true, autoHeadlights: true, daytimeRunning: true },
      ac: { type: "自动空调", rearVents: true, pm25Filter: true },
    }
  },
  {
    brand: "东风风行", model: "菱智", yearRange: "2016-2024",
    manufacturer: "东风风行", vehicleType: "MPV", releaseDate: "2016-01-01", energyType: "汽油",
    specs: {
      engine: { model: "4A92", intake: "自然吸气", displacement: "1.6", layout: "L", cylinders: "4", maxPowerKw: 90, maxPowerPs: 122, maxTorque: 151, fuelGrade: "92号", fuelSupply: "多点电喷" },
      transmission: { type: "手动", description: "5挡手动", gears: 5 },
      body: { form: "MPV", doors: "4-5", seats: "7/9", wheelbase: 3000, length: 5145, width: 1720, height: 1960, curbWeight: 1620 },
      chassis: { drive: "前置后驱", frontSuspension: "双横臂式", rearSuspension: "钢板弹簧" },
      safety: { driverAirbag: "可选", abs: true, rearRadar: "可选" },
      exterior: { slidingDoor: "右侧滑门", wheels: "钢/铝合金 15寸" },
      interior: { seats: "织物", ac: "前后空调可选", seatingConfig: "2+2+3/2+2+2+3" },
      media: { screen: "触控屏可选", bluetooth: "可选", usbAudio: true },
      lights: { halogenHeadlights: true, fogLights: "可选" },
    }
  },

  // ===== 路虎 (非洲高端市场热门) =====
  {
    brand: "路虎", model: "揽胜", yearRange: "2016-2025",
    manufacturer: "路虎(进口)", vehicleType: "全尺寸豪华SUV", releaseDate: "2016-01-01", energyType: "汽油/柴油/混动",
    specs: {
      engine: { model: "AJ200P", intake: "涡轮增压/机械增压", displacement: "3.0", layout: "I", cylinders: "6", maxPowerKw: 294, maxPowerPs: 400, maxTorque: 550, fuelGrade: "95号", fuelSupply: "直喷", mildHybrid: "MHEV", mhev: "48V" },
      transmission: { type: "手自一体(AT)", description: "8速手自一体 ZF", gears: 8 },
      body: { form: "SUV", doors: 5, seats: "4/5/7可选", wheelbase: "2997/3197(LWB)", length: "5052/5252(LWB)", width: 2047, height: 1870, fuelTank: 90, curbWeight: 2495, groundClearance: 295, wadingDepth: 900, approachAngle: 34, departureAngle: 29 },
      chassis: { drive: "前置四驱(全时四驱)", frontSuspension: "双叉臂式空气悬架", rearSuspension: "多连杆式空气悬架", airSuspension: true, terrainResponse: "第2代全地形反馈", diffLock: "中央+后桥差速锁", lowRangeGear: true, rearAxleSteering: true },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, kneeAirbag: true, abs: true, cruiseControl: "全速自适应巡航", laneKeeping: true, autonomousBraking: true, panoramicCamera: "360 3D环绕", nightVision: "可选", clearSightGround: true, autoPark: true },
      exterior: { sunroof: "全景滑动天窗", wheels: "铝合金 21/22/23寸", softCloseDoors: true, powerLiftgate: true, deployableSideSteps: true, pixelLaserLights: "可选", privacyGlass: true },
      interior: { multiFunctionSteering: "真皮加热电动调节", steeringHeating: true, tripComputer: "13.7寸全液晶", fullLCDCluster: true, hud: true, ambientLight: "30色可选", piviPro: true, wirelessCharging: true, refrigerator: "可选", rearExecutiveSeats: "可选" },
      seats: { material: "Semi-Aniline/全苯胺真皮可选", heating: "前后排", ventilation: "前后排", massage: "前后排热石按摩可选", driverMemory: true, rearRecline: "可选 40°仰角", rearFootrest: "可选" },
      media: { screen: "双屏 13.1寸中控+11.4寸后排娱乐可选", bluetooth: true, speakers: "13-35喇叭 Meridian可选 1600W", carplay: true, rearEntertainment: "可选", noiseCancellation: true },
      lights: { ledHeadlights: true, pixelLaser: "数字LED像素激光可选", autoHeadlights: true, daytimeRunning: true, adaptiveHighBeam: true },
      mirrors: { adjustment: "电动调节", heating: true, folding: "电动折叠", memory: true, autoDimming: true },
      wipers: { rainSensing: true },
      ac: { type: "四区自动空调", rearVents: true, pm25Filter: true, ionizer: true, cabinAirPurification: true },
    }
  },
  {
    brand: "路虎", model: "卫士", yearRange: "2020-2025",
    manufacturer: "路虎(进口)", vehicleType: "中大型越野SUV", releaseDate: "2020-06-01", energyType: "汽油/柴油/混动",
    specs: {
      engine: { model: "AJ300", intake: "涡轮增压", displacement: "3.0", layout: "I", cylinders: "6", maxPowerKw: 294, maxPowerPs: 400, maxTorque: 550, fuelGrade: "95号", fuelSupply: "直喷", mildHybrid: "48V" },
      transmission: { type: "手自一体(AT)", description: "8速手自一体 ZF", gears: 8 },
      body: { form: "越野SUV", doors: "3/5", seats: "5/7可选", wheelbase: "2587(90)/3022(110)/3022(130)", length: "4323(90)/4758(110)/5358(130)", width: 2008, height: 1967, groundClearance: 291, wadingDepth: 900, approachAngle: 38, departureAngle: 40 },
      chassis: { drive: "全时四驱", frontSuspension: "双叉臂式空气悬架", rearSuspension: "多连杆式空气悬架", airSuspension: true, terrainResponse: "第2代全地形反馈", diffLock: "中央+后桥差速锁", lowRangeGear: true, configurableTerrain: true },
      safety: { driverAirbag: true, frontSideAirbags: true, headCurtainAirbags: true, abs: true, cruiseControl: "全速自适应巡航", laneKeeping: true, autonomousBraking: true, panoramicCamera: "360 3D+透明底盘", wadeSensing: true, clearSightGround: true },
      exterior: { sunroof: "全景天窗/折叠软顶可选", wheels: "铝合金 18/19/20/22寸", roofRails: true, sidemountedGearCarrier: "可选", ladder: "可选", snorkelReady: true, expeditionRack: "可选", spareTire: "后挂式" },
      interior: { multiFunctionSteering: true, fullLCDCluster: true, hud: "可选", piviPro: true, rubberFlooring: "可选", washableInterior: "可选" },
      seats: { material: "Resist织物/皮革/温莎真皮可选", heating: "前排可选", driverMemory: true },
      media: { screen: "10/11.4寸中控屏", bluetooth: true, speakers: "6-15喇叭 Meridian可选", carplay: true },
      lights: { ledHeadlights: true, matrixLed: "可选", autoHeadlights: true, daytimeRunning: true },
      ac: { type: "双区/三区自动空调", rearVents: true, pm25Filter: true },
    }
  },

];

async function main() {
  // Seed admin & dealer users
  const adminEmail = "admin@honglajiao1688.com";
  const adminPw = bcrypt.hashSync("Admin@1688#hj", 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, password: adminPw, name: "Admin", role: "admin", phone: "+8613800000000", company: "ChinaCarExport", country: "China" },
  });
  console.log("✅ Admin account seeded: admin@honglajiao1688.com / Admin@1688#hj");

  await prisma.user.upsert({
    where: { email: "dealer@honglajiao1688.com" },
    update: {},
    create: { email: "dealer@honglajiao1688.com", password: bcrypt.hashSync("Dealer@1688#hj", 12), name: "Demo Dealer", role: "dealer", company: "Africa Auto Trading Co.", country: "Nigeria" },
  });
  console.log("✅ Dealer account seeded: dealer@honglajiao1688.com / Dealer@1688#hj");

  // Seed vehicle specs
  for (const spec of vehicleSpecs) {
    const id = `${spec.brand}-${spec.model}-${spec.yearRange}`.toLowerCase().replace(/\s+/g, "-");
    // Merge vehicleType, releaseDate, yearRange into specsJson alongside engine/transmission/etc.
    const mergedSpecs = {
      ...spec.specs,
      vehicleType: spec.vehicleType,
      releaseDate: spec.releaseDate,
      yearRange: spec.yearRange,
    };
    await prisma.vehicleSpec.upsert({
      where: { id },
      update: {
        specsJson: JSON.stringify(mergedSpecs),
        manufacturer: spec.manufacturer,
        energyType: spec.energyType,
      },
      create: {
        id,
        brand: spec.brand,
        series: spec.model, // schema uses `series` for model/series name
        manufacturer: spec.manufacturer,
        energyType: spec.energyType,
        specsJson: JSON.stringify(mergedSpecs),
      },
    });
  }
  console.log(`✅ ${vehicleSpecs.length} vehicle specs seeded`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

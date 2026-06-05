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
    await prisma.vehicleSpec.upsert({
      where: { id: `${spec.brand}-${spec.model}-${spec.yearRange}`.toLowerCase().replace(/\s+/g, "-") },
      update: {
        specs: JSON.stringify(spec.specs),
        manufacturer: spec.manufacturer,
        vehicleType: spec.vehicleType,
        releaseDate: spec.releaseDate,
        energyType: spec.energyType,
      },
      create: {
        id: `${spec.brand}-${spec.model}-${spec.yearRange}`.toLowerCase().replace(/\s+/g, "-"),
        brand: spec.brand,
        model: spec.model,
        yearRange: spec.yearRange,
        manufacturer: spec.manufacturer,
        vehicleType: spec.vehicleType,
        releaseDate: spec.releaseDate,
        energyType: spec.energyType,
        specs: JSON.stringify(spec.specs),
      },
    });
  }
  console.log(`✅ ${vehicleSpecs.length} vehicle specs seeded`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

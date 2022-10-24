let Koa = require("koa");
const nodemailer = require("nodemailer");
var fs = require("fs");
let router = require("koa-router")();
const path = require("path");
var sourceMap = require("source-map");
const render = require("koa-swig");
const co = require("co");
const bodyParser = require("koa-bodyparser");
const cors = require("koa2-cors");
let app = new Koa();
app.use(cors());
let dataArr = [];
let idPool = [];

app.use(bodyParser());

app.use(async (ctx, next) => {
  // 处理options 次数
  ctx.set("Access-Control-Max-Age", 60000);
  await next();
});

router.get("/findAll", async (ctx) => {
  let lists = dataArr;
  ctx.body = lists;
});
router.get("/delAll", async (ctx) => {
  dataArr = [];
  idPool = [];
  ctx.body = {
    code: 200,
    success: 1,
    message: "清空成功",
  };
});

router.post("/add1", async (ctx) => {
  try {
    let ob = JSON.parse(Object.keys(ctx.request.body)[0]);
    if (ob.id) {
      if (!idPool.includes(ob.id)) {
        dataArr.push(ob);
        idPool.push(ob.id);

        if (ob.sendEmail) {
          main().catch(console.error);
        }
      }
    }
  } catch (e) {}
  ctx.body = {
    code: 200,
    success: 1,
    message: "添加成功",
  };
});
let indicators = {};
router.post("/saveIndicators", async (ctx) => {
  indicators = ctx.request.body;
  ctx.body = { status: "ok" };
});
router.get("/getIndicators", async (ctx) => {
  ctx.body = { indicators };
});

app.context.render = co.wrap(
  render({
    root: __dirname + "/views",
    autoescape: true,
    cache: false,
    ext: "html",
    writeBody: false,
  })
);
router.get("/", function* (next) {
  render("index", {
    title: "Hello World",
  });
});
// const errlist = [];
// let id = 0;
// var sourcesPathMap = {};
// router.post("/report", async (ctx) => {
//   const paramObj = ctx.request.body;
//   paramObj.id = ++id;
//   errlist.push(paramObj);
//   ctx.body = {};
// let data = await DB.insert("list", ctx.request.body);
// if (data.result.ok) {
//   //进行重定向
//   ctx.redirect("/");
// } else {
//   ctx.redirect("/add");
// }
// });
// router.get("/getDeliteById", async (ctx) => {
//   var errid = 1;

//   var obj = getItemFromList(errlist, { id: errid });
//   var url = obj.url,
//     row = obj.row,
//     col = obj.col;

//   var filename = path.basename(url);
//   console.log("pp", filename);

//   lookupSourceMap(
//     path.join("sm", "index.js" + ".map"),
//     row,
//     col,
//     function (res) {
//       var source = res.source;
//       var filename = path.basename(source);
//       var filepath = path.join(smDir, filename);
//       console.log({
//         file: res.sourcesContent,
//         msg: obj.msg,
//         source: res.source,
//         row: res.line,
//         column: res.column,
//       });
//     }
//   );
// });
// function fixPath(filepath) {
//   return filepath.replace(/\.[\.\/]+/g, "");
// }
// function lookupSourceMap(mapFile, line, column, callback) {
//   fs.readFile(mapFile, function (err, data) {
//     if (err) {
//       console.error(err);
//       return;
//     }

//     var fileContent = data.toString(),
//       fileObj = JSON.parse(fileContent),
//       sources = fileObj.sources;

//     sources.map((item) => {
//       sourcesPathMap[fixPath(item)] = item;
//     });

//     var consumer = new sourceMap.SourceMapConsumer(fileContent);
//     var lookup = {
//       line: parseInt(line),
//       column: parseInt(column),
//     };
//     var result = consumer.originalPositionFor(lookup);

//     var originSource = sourcesPathMap[result.source],
//       sourcesContent = fileObj.sourcesContent[sources.indexOf(originSource)];

//     result.sourcesContent = sourcesContent;

//     callback && callback(result);
//   });
// }
// function getItemFromList(list, obj) {
//   // console.log(list);
//   var key = Object.keys(obj)[0];
//   var val = obj[key];
//   // console.log(key, val); // id 0

//   var res = null;
//   list.map((item) => {
//     if (item[key] == val) {
//       res = item;
//     }
//   });

//   return res;
// }
app
  .use(router.routes()) /*启动路由*/
  .use(router.allowedMethods()); /* 可配可不配置,建议配置 */

app.listen(8083);

// 使用async..await 创建执行函数
async function main() {
  // 如果你没有一个真实邮箱的话可以使用该方法创建一个测试邮箱
  // let testAccount = await nodemailer.createTestAccount();

  // 创建Nodemailer传输器 SMTP 或者 其他 运输机制
  let transporter = nodemailer.createTransport({
    host: "smtp.163.com", // 第三方邮箱的主机地址
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "18618166564@163.com", // 发送方邮箱的账号
      pass: "STXJDTCDHFYDHGQA", // 邮箱授权密码
    },
  });

  // 定义transport对象并发送邮件
  let info = await transporter.sendMail({
    from: '"Dooring 👻" <18618166564@163.com>', // 发送方邮箱的账号
    to: "17363165056@163.com", // 邮箱接受者的账号
    subject: "quick_@_@", // Subject line
    text: "404 ?", // 文本内容
    html: "<h1>404 🌶  🏃🏃🏃🏃🏃</h1>", // html 内容, 如果设置了html内容, 将忽略text内容
  });
}

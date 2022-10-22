let Koa = require("koa");
const nodemailer = require("nodemailer");

let router = require("koa-router")();
const path = require("path");

const bodyParser = require("koa-bodyparser");
const cors = require("koa2-cors");
let app = new Koa();
app.use(cors());
let dataArr = [];
let idPool = [];
// render(app, {
//   root: path.join(__dirname, "views"), //规定视图的位置
//   extname: ".html", //后缀名
//   debug: process.env.NODE_ENV !== "production", //是否开启调试模式
// });
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
  // console.log("ctx", ctx);
  // console.log("ctx", ctx.request);
  // console.log("ctx", ctx.request.body);

  try {
    // console.log("d", ctx.request.body[0]);
    // console.log("dddd", Object.keys(ctx.request.body));
    let ob = JSON.parse(Object.keys(ctx.request.body)[0]);

    // console.log(ob);

    if (ob.id) {
      if (!idPool.includes(ob.id)) {
        dataArr.push(ob);
        idPool.push(ob.id);

        if (ob.sendEmail) {
          main().catch(console.error);
        }
      }
    }
  } catch (e) {
    // console.log("err", e);
  }
  ctx.body = {
    code: 200,
    success: 1,
    message: "添加成功",
  };
});
// router.post("/doAdd", async (ctx) => {
//   let data = await DB.insert("list", ctx.request.body);
//   if (data.result.ok) {
//     //进行重定向
//     ctx.redirect("/");
//   } else {
//     ctx.redirect("/add");
//   }
// });

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

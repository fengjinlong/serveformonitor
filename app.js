let Koa = require("koa");

//已经引入了koa-art-template的模版
let router = require("koa-router")();
// const render = require("koa-art-template");
const path = require("path");
// const list = require('./db/index')

const bodyParser = require("koa-bodyparser");
const cors = require("koa2-cors");
let app = new Koa();
app.use(cors());
const dataArr = [];
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
router.get("/del", async (ctx) => {
  dataArr = [];
  ctx.body = {
    code: 200,
    success: 1,
    message: "清空成功",
  };
});

router.post("/add1", async (ctx) => {
  console.log("ctx", ctx);

  dataArr.push(ctx.request.body);
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

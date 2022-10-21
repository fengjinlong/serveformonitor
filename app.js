let Koa = require("koa");

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
      }
    }
  } catch (e) {
    console.log("err", e);
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

const Koa = require('koa');
const Router = require('@koa/router');
const slow = require('koa-slow');
const cors = require('@koa/cors');

const app = new Koa();
const router = new Router();

app.use(cors());

//Логгер запросов
app.use(async (ctx, next) => {
  const start = Date.now();
  const isApi = ctx.url.startsWith('/api/');
  const tag = isApi ? '🟢 API' : '⚪ STATIC'; //Чтобы отличать запросы к API от статики и сразу видеть цветом
  console.log(`${tag} → ${ctx.method} ${ctx.url}`);
  await next();
  console.log(`${tag} ← ${ctx.status} ${ctx.url} (${Date.now() - start} ms)`);
});
// Задержка 2 секунды для API — чтобы скелетон был виден
app.use(slow({ url: /\/api\/news/, delay: 2000 }));

router.get('/api/news', (ctx) => {
  // Лог внутри хэндлера — показывает, что запрос дошёл до роутера
  console.log('  → handler /api/news вызван');
  ctx.body = [
    { id: 1, title: 'Новость 1', text: 'Текст первой новости', avatar: 'https://picsum.photos/50/50?random=1' },
    { id: 2, title: 'Новость 2', text: 'Текст второй новости', avatar: 'https://picsum.photos/50/50?random=2' },
    { id: 3, title: 'Новость 3', text: 'Текст третьей новости', avatar: 'https://picsum.photos/50/50?random=3' },
  ];
});

app.use(router.routes()).use(router.allowedMethods());

//Явный лог при старте с портом
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is up and running on http://localhost:${PORT}`);
});
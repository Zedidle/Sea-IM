import App from '../App.vue'


// const home = r => require.ensure([], () => r(require('../page/home/home')), 'home')


export default [{
    path: '/',
    component: App, //顶层路由，对应index.ejs
    children: [     //二级路由。对应App.vue
    ]
}]
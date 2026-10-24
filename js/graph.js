// js/graph.js
var chart = echarts.init(document.getElementById('graph'));

// 模拟数据（后续等知识点筛选员给真实数据直接替换这里）
var rawData = {
  name: '数学分析',
  children: [
    { name: '第一章 极限与连续', children: [
      { name: '函数', children: [{ name: '函数定义', isLeaf: true, link: 'pages/demo.html?id=func' }] },
      { name: '极限', children: [{ name: '极限性质', isLeaf: true, link: 'pages/demo.html?id=limit' }] }
    ]},
    { name: '第二章 微分学', children: [
      { name: '导数', children: [{ name: '求导法则', isLeaf: true, link: 'pages/demo.html?id=deriv' }] },
      { name: '中值定理', children: [{ name: '罗尔定理', isLeaf: true, link: 'pages/demo.html?id=roll' }] }
    ]}
  ]
};

var nodes = [], links = [];
function traverse(node, parent) {
  nodes.push({ 
    id: node.name, 
    name: node.name, 
    category: parent ? (parent === '数学分析' ? 1 : 2) : 0, 
    link: node.link,
    collapsed: false // 用于展开/收起
  });
  if (parent) links.push({ source: parent, target: node.name });
  if (node.children) node.children.forEach(c => traverse(c, node.name));
}

traverse(rawData, null);

var option = {
  tooltip: { trigger: 'item', formatter: '{b}' },
  legend: { data: ['中心','章节','小节/知识点'], top: 10 },
  series: [{
    type: 'graph',
    layout: 'force',
    data: nodes,
    links: links,
    categories: [{name:'中心'}, {name:'章节'}, {name:'小节/知识点'}],
    roam: true, // 关键：开启滚轮缩放 + 鼠标拖拽画布
    scaleLimit: { min: 0.5, max: 3 }, // 限制缩放，防止力导向图散架
    draggable: true,
    force: { repulsion: 400, edgeLength: [100, 180], gravity: 0.08 },
    label: { show: true, position: 'right', fontSize: 12 },
    lineStyle: { color: 'source', curveness: 0.05 },
    emphasis: { focus: 'adjacency' }
  }]
};

chart.setOption(option);

// 【修复滚轮】防止浏览器默认缩放拦截
document.getElementById('graph').addEventListener('wheel', function(e) {
  // 如果不加这行，有时浏览器会整体缩放页面而不是缩放图谱
  e.preventDefault(); 
}, { passive: false });

// 点击交互：末级跳转画板，非末级（章节/节）可扩展展开/收起
chart.on('click', function(params) {
  if (params.data.link) {
    window.location.href = params.data.link; // 跳转 GeoGebra 画板
  } else {
    // 简易展开/收起（后续可优化为动态过滤 nodes/links）
    // 目前力导向图点击节点会有高亮，满足基础交互
    console.log('点击了节点：', params.name);
  }
});

window.addEventListener('resize', () => chart.resize());
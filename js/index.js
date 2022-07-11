// 需要将所有的 DOM 元素对象以及相关资源都加载完毕之后，再来实现的事件
window.onload = function () {
  /**
   * 思路：
   *  1、先获取路径导航的页面元素
   *  2、再来获取所需要的数据 ( data.js -> goodData.path )
   *  3、数据是动态产生的（我们需要创建 DOM 元素），那么相应的 DOM 元素应该也是动态产生的
   *  4、在遍历数据创建 DOM 元素的最后一条，只创建 a 标签
   */

  // 1. 获取页面导航的元素对象
  const navPath = document.querySelector('#navPath')

  // 2. 获取数据
  const path = goodData.path

  // 3. 遍历数据
  for (let i = 0; i < path.length - 1; i++) {
    // 创建 a 标签
    let aNode = document.createElement('a')
    aNode.href = path[i].url
    aNode.innerText = path[i].title
    // 创建 i 标签
    let iNode = document.createElement('i')
    iNode.innerText = '/'
    // 追加
    navPath.appendChild(aNode)
    navPath.appendChild(iNode)
  }
  let aNode = document.createElement('a')
  aNode.innerText = path[path.length - 1].title
  navPath.appendChild(aNode)
} 
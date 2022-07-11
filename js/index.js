// 需要将所有的 DOM 元素对象以及相关资源都加载完毕之后，再来实现的事件
window.onload = function () {

  navPathDataBind()
  // 路径导航得数据渲染
  function navPathDataBind () {
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

  // 放大镜的移入移出
  function bigClassBind () {
    /**
     * 思路：
     *  1. 获取小图框元素对象，并且设置移入事件 (onmouseover、onmouseenter )
     *    onmouseover 有事件冒泡效果
     *    onmouseenter 无事件冒泡效果
     *    在这里我们把鼠标移入小图框时并不需要，将事件依次传递给其父元素，所以选择 onmouseenter
     *  2. 动态创建蒙版元素以及大图框的元素和大图片
     *  3. 移出时需要移除蒙版元素、大图框
    */

    let leftTop = document.querySelector('#leftTop')

    // 1. 获取小图框元素  
    let smallPic = document.querySelector('#smallPic')
    console.log(smallPic)
    // 2. 设置移入事件
    smallPic.onmouseenter = function () {
      // 3. 创建蒙版元素
      const maskDiv = document.createElement('div')
      maskDiv.className = "mask"

      // 4. 创建大图框元素
      const bigPic = document.createElement('div')
      bigPic.id = "bigPic"

      // 5. 创建大图片元素
      const bigImage = document.createElement('img')
      bigImage.src = "images/b1.png"

      // 6. 大图框追加大图片
      bigPic.appendChild(bigImage)

      // 7. 小图框追加蒙版
      smallPic.appendChild(maskDiv)

      // 8. 让小图框追加蒙版元素
      leftTop.appendChild(bigPic)

      // 设置移动事件
      smallPic.onmousemove = function (e) {
        // e.clientX: 鼠标点距离浏览器左侧 x 轴的值
        // smallPic.getBoundingClientRect().left: 小图框元素距离浏览器左侧可视left的值
        // maskDiv.offsetLeft 蒙版元素占位宽度
        let left = e.clientX - smallPic.getBoundingClientRect().left - maskDiv.offsetLeft / 2
        let top = e.clientY - smallPic.getBoundingClientRect().top - maskDiv.offsetLeft / 2

        if (left < 0) {
          left = 0
        } else if (left > smallPic.clientWidth - maskDiv.offsetWidth) {
          left = smallPic.clientHeight - maskDiv.offsetHeight
        }

        if (top < 0) {
          top = 0
        } else if (top > smallPic.clientHeight - maskDiv.offsetHeight) {
          top = smallPic.clientHeight - maskDiv.offsetHeight
        }

        maskDiv.style.left = left + 'px'
        maskDiv.style.top = top + 'px'

        /**
         * 移动比例的关系 = 蒙版元素移动的距离  / 大图片元素移动的距离
         * 蒙版元素移动的距离 = 小图框宽度 - 蒙版元素宽度
         * 大图片元素移动的距离 = 大图片宽度 - 大图框元素的宽度
         * */
        let scale = (smallPic.clientWidth - maskDiv.offsetWidth) / (bigImage.offsetWidth - bigPic.clientWidth)
        bigImage.style.left = -left / scale + 'px'
        bigImage.style.top = -top / scale + 'px'
      }

      smallPic.onmouseleave = function () {
        // 让小图框移除蒙版元素
        smallPic.removeChild(maskDiv)

        // leftTop 移除 bigPic
        leftTop.removeChild(bigPic)
      }
    }
  }
  bigClassBind()
} 
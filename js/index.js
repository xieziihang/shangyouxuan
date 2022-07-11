// 需要将所有的 DOM 元素对象以及相关资源都加载完毕之后，再来实现的事件
window.onload = function () {
  // 声明一个记录点击的缩略图下标
  let bigImgIndex = 0

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
      bigImage.src = goodData.imagessrc[bigImgIndex].b

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

  // 动态渲染放大镜缩略图的数据
  thumbnailData()
  function thumbnailData () {
    /**
     * 思路：
     *  1、先获取 piclist 元素下面的 ul
     *  2、在获取 data.js 文件下的 goodData -> imagessrc
     *  3、遍历数组，根据数组的长度来创建 li 元素
     *  4、ul 遍历追加 li 元素
     * */

    // 1. 获取 piclist 下面的 ul
    const ul = document.querySelector('#piclist ul')

    // 2. 获取 imagessrc 数据
    const imagessrc = goodData.imagessrc

    // 3. 遍历数组
    for (let i = 0; i < imagessrc.length; i++) {
      // 4. 创建 li 元素
      const newLi = document.createElement('li')

      // 5. 创建 img 元素
      const newImage = document.createElement('img')
      newImage.src = imagessrc[i].s

      // 6. 让 li 追加 img 元素
      newLi.appendChild(newImage)

      // 7. 让 ul 追加 li 元素
      ul.appendChild(newLi)
    }
  }

  // 点击缩略图的效果
  thumbnailClick()
  function thumbnailClick () {
    /**
     * 1. 获取所有的 li 元素并且循环发生点击事件
     * 2. 点击缩略图需要确定其下标位置来找到对应小图路径和大图路径替换现有 src 的值
     * */

    // 1. 获取所有的 li 元素
    let liNodes = document.querySelectorAll('#piclist ul li')

    let smallPic_img = document.querySelector('#smallPic img')

    // 小图的路径需要默认和 imagessrc 的第一个元素的小兔路径相同
    smallPic_img.src = goodData.imagessrc[0].s

    for (let i = 0; i < liNodes.length; i++) {
      liNodes[i].onclick = function () {
        bigImgIndex = i

        smallPic_img.src = goodData.imagessrc[i].s
      }
    }
  }

  // 点击缩略图左右箭头想过
  thumbnailLeftRightClick()
  function thumbnailLeftRightClick () {
    /**
     * 思路：
     * 1、先获取左右两端的箭头
     * 2、再获取可视的 div 以及 ul 元素和所有的 li 元素
     * 3、计算（发生起点，步长，总体运动的距离值）
     * 4、然后再发生点击事件
    */

    // 1. 获取箭头元素
    let prev = document.querySelector('#leftBottom a.prev')
    let next = document.querySelector('#leftBottom a.next')

    // 2. 获取可视的 div 以及 ul 元素和所有的 li 元素
    let piclist = document.querySelector('#piclist')

    let ul = document.querySelector('#piclist ul')

    let liNodes = document.querySelectorAll('#piclist ul li')

    // 3. 计算
    // 步长
    let start = 0
    // 起点
    let step = (liNodes[0].offsetWidth + 20) * 2
    // 总体运动的距离值 ul 的宽度 - div 宽的宽度 = (图片的总数 - div中显示的数量) * (li + 20)
    let endPosition = (liNodes.length - 5) * (liNodes[0].offsetWidth + 20)

    // 4. 发生事件
    next.onclick = function () {
      start += step
      if (start > endPosition) {
        start = endPosition
      }
      ul.style.left = -start + 'px'
    }

    prev.onclick = function () {
      start -= step
      if (start < 0) {
        start = 0
      }
      ul.style.left = -start + 'px'
    }
  }
} 
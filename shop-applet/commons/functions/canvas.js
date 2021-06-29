/**
 * 溢出文字显示省略号
 * @param ctx canvas对象
 * @param content 文本内容
 * @param drawX x坐标
 * @param drawY y坐标
 * @param lineHeight 行高
 * @param lineMaxWidth 每行文本的最大宽度
 * @param lineNum 最多绘制的行数
 */
function textPrewrap(
  ctx,
  content,
  drawX,
  drawY,
  lineHeight,
  lineMaxWidth,
  lineNum
) {
  let drawTxt = '' // 当前绘制的内容
  let drawLine = 1 // 第几行开始绘制
  let drawIndex = 0 // 当前绘制内容的索引
  // 判断内容是否可以一行绘制完毕
  if (ctx.measureText(content).width <= lineMaxWidth) {
    ctx.fillText(content.substring(drawIndex, i), drawX, drawY)
  } else {
    for (var i = 0; i < content.length; i++) {
      drawTxt += content[i]
      if (ctx.measureText(drawTxt).width >= lineMaxWidth) {
        if (drawLine >= lineNum) {
          ctx.fillText(content.substring(drawIndex, i) + '...', drawX, drawY)
          // console.log(content.substring(drawIndex, i));
          break
        } else {
          ctx.fillText(content.substring(drawIndex, i + 1), drawX, drawY)
          drawIndex = i + 1
          drawLine += 1
          drawY += lineHeight
          drawTxt = ''
        }
      } else {
        // 内容绘制完毕，但是剩下的内容宽度不到lineMaxWidth
        if (i === content.length - 1) {
          ctx.fillText(content.substring(drawIndex), drawX, drawY)
        }
      }
    }
  }
}

/**
 * 画布截取圆形区域
 * @param ctx canvas对象
 * @param img 需截取图像
 * @param avatarX 图像在画布的水平位置
 * @param avatarY 图像在画布的垂直位置
 * @param imgWidth 图像宽度
 * @param imgHeight 图像高度
 * @param num 留白填充
 */
function drawCircle({
  ctx,
  img,
  avatarX,
  avatarY,
  imgWidth,
  imgHeight,
  num = 0
}) {
  ctx.save()
  ctx.beginPath() //开始绘制
  ctx.fillStyle = '#fff'
  ctx.arc(
    (imgWidth + num) / 2 + avatarX,
    (imgHeight + num) / 2 + avatarY,
    (imgWidth + num) / 2,
    0,
    Math.PI * 2,
    false
  )
  ctx.fill()
  ctx.clip()
  ctx.drawImage(img, avatarX + num / 2, avatarY + num / 2, imgWidth, imgHeight)
  ctx.closePath()
  ctx.restore()
}

/**
 * 绘制圆角矩形
 * @param ctx canvas对象
 * @param x 在画布的水平位置
 * @param y 在画布的垂直位置
 * @param width 宽度
 * @param height 高度
 * @param radius 圆角
 * @param fillColor 填充颜色
 */
function fillRoundRect(cxt, x, y, width, height, radius, fillColor) {
  // 圆的直径必然要小于矩形的宽高
  if (2 * radius > width || 2 * radius > height) {
    return false
  }
  cxt.save()
  cxt.translate(x, y)
  // 绘制圆角矩形的各个边
  drawRoundRectPath(cxt, width, height, radius)
  cxt.fillStyle = fillColor || '#000' // 若是给定了值就用给定的值否则给予默认值
  cxt.fill()
  cxt.restore()
}

/**
 * 绘制圆角矩形各边以及圆角
 * @param ctx canvas对象
 * @param width 宽度
 * @param height 高度
 * @param radius 圆角
 */
function drawRoundRectPath(cxt, width, height, radius) {
  cxt.beginPath(0)
  // 从右下角顺时针绘制，弧度从0到1/2PI
  cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2)
  // 矩形下边线
  cxt.lineTo(radius, height)
  // 左下角圆弧，弧度从1/2PI到PI
  cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI)
  // 矩形左边线
  cxt.lineTo(0, radius)
  // 左上角圆弧，弧度从PI到3/2PI
  cxt.arc(radius, radius, radius, Math.PI, (Math.PI * 3) / 2)
  // 上边线
  cxt.lineTo(width - radius, 0)
  // 右上角圆弧
  cxt.arc(width - radius, radius, radius, (Math.PI * 3) / 2, Math.PI * 2)
  // 右边线
  cxt.lineTo(width, height - radius)
  cxt.closePath()
}

export default {
  textPrewrap,
  drawCircle,
  fillRoundRect,
  drawRoundRectPath
}

//格式化为小程序通用形式的富文本
function formatRich(richtext) {
  richtext = richtext || ''
  // return richtext.replace(/\<img/g, "<img style='max-width:100%;height:auto'");
  // return richtext.replace(/\<img/g, "<img width='100%'");
  let richtext1 = richtext.replace(
    /style=""/g,
    "style='max-width:100%;height:auto'"
  )
  return richtext1.replace(/\<img/g, "<img style='max-width:100%;height:auto'")
}

export default formatRich

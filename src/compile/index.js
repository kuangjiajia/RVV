import _ from '../utils'
import c from './compileUtil'

export default class {
  constructor(el, rv) {
    this.el = el
    this.rv = rv
    if (this.el) {
      let fragment = this.nodeToFragment(el)
      this.compile(fragment)
      this.el.appendChild(fragment)
    }
  }
  nodeToFragment(el) {
    let fragment = document.createDocumentFragment()
    let firstChild = el.firstChild
    while (firstChild) {
      fragment.appendChild(firstChild)
      firstChild = el.firstChild
    }
    return fragment
  }
  compile(fragment) {

    let childNodes = fragment.childNodes
    Array.from(childNodes).forEach(node => {
      if (_.isElement(node)) {
        //element节点
        //编译elment的属性什么的
        this.compileElement(node)
        //继续向下编译
        this.compile(node)
      } else {
        //文本节点
        this.compileText(node)
      }
    })
  }
  compileElement(node) {
    const attrs = node.attributes
    Array.from(attrs).forEach(attr => {
      let attrName = attr.name
      if (attrName.includes("r-")) {
        attrName = attrName.slice(2)
        c[attrName](node, this.rv, attr.value)
      }
    })
  }
  compileText(node) {
    const content = node.textContent
    if (_.regs.text.test(content)) {
      c["text"](node, this.rv, content)
    }
  }
}
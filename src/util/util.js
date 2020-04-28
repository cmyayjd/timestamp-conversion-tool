
export default class Path {
  constructor(el){
    this.el = el
    this.init()
  }

  init(){
    this.el.style.strokeDasharray = this.el.style.strokeDashoffset = this.el.getTotalLength()
  }

  render(val){
    this.el.style.strokeDashoffset = this.el.getTotalLength() * ( 1 - val )
  }

  progress = function( val, callback ) {
		this.render(val);
		if( callback && typeof callback === 'function' ) {
			setTimeout( callback, 200 )
		}
	}
}
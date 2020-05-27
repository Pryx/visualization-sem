export function Circle(context, x,y,d,style){
  this.x = x
  this.y = y
  this.d = d
  this.style = style || {}
  this.context = context;
}

Circle.prototype = {
  draw:function(){
    let context = this.context;
    let style = this.style;
    if (!style.stroke && !style.fill) return

    //Offset
    let radius = (this.d / 2) * .5;

    //X, Y end
    let xe = this.x + this.d;
    let ye = this.y + this.d;

    //X, Y center
    let xc = this.x + this.d / 2; 
    let yc = this.y + this.d / 2;

    context.save()
    context.beginPath();
    context.moveTo(this.x, yc);
    context.bezierCurveTo(this.x, yc - radius, xc - radius, this.y, xc, this.y);
    context.bezierCurveTo(xc + radius, this.y, xe, yc - radius, xe, yc);
    context.bezierCurveTo(xe, yc + radius, xc + radius, ye, xc, ye);
    context.bezierCurveTo(xc - radius, ye, this.x, yc + radius, this.x, yc);
    context.closePath();

    if (style.fill!==undefined){
      context.fillStyle = style.fill
      context.fill()
    }

    if (style.stroke!==undefined){
      context.strokeStyle = style.stroke.color;
      context.lineWidth = style.stroke.width
      context.stroke()
    }
    context.restore()
  }

}


export function Path (context, x1, y1, x2, y2, style){
  this.points = [ {x:x1,y:y1}, {x:x2,y:y2} ]
  this.style = style || {}
  this.context = context;
}

Path.prototype = {
  draw:function(){
    let context = this.context;
    context.save()
    context.beginPath();

    context.moveTo(this.points[0].x+.5, this.points[0].y+.5);
    context.lineTo(this.points[1].x+.5, this.points[1].y+.5);

    let style = this.style
    context.closePath()

    if (style.fill!==undefined){
      context.fillStyle = style.fill
      context.fill()
    }

    if (style.stroke!==undefined){
      context.strokeStyle = style.stroke.color;
      context.lineWidth = style.stroke.width
      context.stroke()
    }else{
      console.error("No stroke style for path")
    }
		context.restore()
  }
}
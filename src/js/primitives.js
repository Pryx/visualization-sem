export function Circle(context, center, d, style, text){
  this.x = center.x
  this.y = center.y
  this.d = d
  this.style = style || {}
  this.text = text || undefined
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

    if (this.text!==undefined && this.style.font.size!==undefined  
          && this.style.font.family!==undefined )
    {

      this.context.font = this.style.font.size + "px " + this.style.font.family;
      var width = context.measureText(this.text).width; /// width in pixels
      context.fillStyle = '#FFF';
      context.fillRect(xc-2-width/2, yc-(this.style.font.size/2+2), width+4, this.style.font.size+4);
      context.fillStyle = '#000';
      this.context.fillText(this.text, xc-width/2, yc+this.style.font.size/2);     
    }

    context.restore()
  }

}


export function Path (context, p1, p2, offset, style, text){
  this.points = [ p1, p2 ]
  this.style = style || {}
  this.context = context;
  this.text = text || undefined
  this.offset = offset
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


    let direction = this.points[0].subtract(this.points[1]).normalize();
    let direction_offset = direction.multiply(this.offset);
    let direction_rot1 = direction.rotate(style.triangle.degree).multiply(style.triangle.size).add(direction_offset);
    let direction_rot2 = direction.rotate(-style.triangle.degree).multiply(style.triangle.size).add(direction_offset);

    context.beginPath();
    context.fillStyle = style.fill
    context.moveTo(this.points[1].x+direction_offset.x, this.points[1].y+direction_offset.y);
    context.lineTo(this.points[1].x+direction_rot1.x, this.points[1].y+direction_rot1.y);
    context.lineTo(this.points[1].x+direction_rot2.x, this.points[1].y+direction_rot2.y);
    context.fill();
    context.closePath()

    if (this.text!==undefined && this.style.font.size!==undefined  
          && this.style.font.family!==undefined )
    {
      let xc = (this.points[0].x+.5+this.points[1].x+.5)/2;
      let yc = (this.points[0].y+.5 +this.points[1].y+.5)/2;


      this.context.font = this.style.font.size + "px " + this.style.font.family;
      var width = context.measureText(this.text).width; /// width in pixels
      context.fillStyle = '#FFF';
      context.fillRect(xc-2-width/2, yc-(this.style.font.size/2+2), width+4, this.style.font.size+4);
      context.fillStyle = '#000';
      this.context.fillText(this.text, xc-width/2, yc+this.style.font.size/2);     
    }

		context.restore()
  }
}

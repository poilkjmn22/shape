var Shape = function(){
   this.lineWidth = 2;
   this.strokeStyle = 'rgba(46, 203, 113, 0.9)';
    this.fillStyle = 'rgba(46, 203, 113, 0.8)';
}

Shape.prototype = {
  fill: function (context) {
     context.save();
     context.lineWidth = this.lineWidth;
     context.fillStyle = this.fillStyle;
     this.createPath(context);
     context.fill();
     context.restore();
  }

  ,stroke: function (context) {
     context.save();
     context.lineWidth = this.lineWidth;
     context.strokeStyle = this.strokeStyle;
     this.createPath(context);
     context.stroke();
     context.restore();
  }

  ,createPath: function (context) {
     throw 'createPath(context) not implemented';
  }

  ,getPoints: function(){
        var pointCoords = (arguments.length == 1)? arguments[0].split(','):arguments;//点坐标数组
        var pointCount =  (pointCoords.length) >> 1;
        var points = [];

        for (var i = 0; i < pointCount ; i++) {
           points.push(new Point(parseFloat(pointCoords[2*i]), parseFloat(pointCoords[2*i+1])));
        };
        
        return points;
  }

  ,collidesWith: function (shape) {
  var axes = this.getAxes().concat(shape.getAxes());
  return !this.separationOnAxes(axes, shape);
  }

  ,separationOnAxes: function (axes, shape) {
      for (var i=0; i < axes.length; ++i) {
         axis = axes[i];
         projection1 = shape.project(axis);
         projection2 = this.project(axis);

         if (! projection1.overlaps(projection2)) {
            return true; // don't have to test remaining axes
         }
      }
      return false;
  }

  ,move: function (dx, dy) {
      throw 'move(dx, dy) not implemented';
  }

  ,getAxes: function () {
      throw 'getAxes() not implemented';
  }

  ,project: function (axis) {
      throw 'project(axis) not implemented';
  }
  
  ,isPointInPath: function (context, x, y) {
      this.createPath(context);
      return context.isPointInPath(x, y);
  }
}

var Point = function(x, y){
  this.x = x;
  this.y = y;
}

var Segment = function(vs,ve){//线段
  Shape.call(this);
  this.vStart = vs;
  this.vEnd = ve;
}

Common.Base.inheritPrototype(Segment, Shape);//寄生组合式继承.

Segment.prototype.createPath = function(context){
  context.beginPath();

  context.moveTo(this.vStart.x, this.vStart.y);
  context.lineTo(this.vEnd.x, this.vEnd.y);
};

Segment.prototype.getLength = function(){
  return this.vEnd.subtract(this.vStart).getMagnitude();
}

Segment.prototype.getPoints = function(){
  return {
     pointStart: new Point(this.vStart.x, this.vStart.y)
     ,pointEnd: new Point(this.vEnd.x, this.vEnd.y)
  }
}

Segment.prototype.getVector = function(){
  return new Vector(this.vEnd.subtract(this.vStart));
}

Segment.prototype.isPointOn = function(point){//点在线段上
  var vp = new Vector(point.x, point.y);
  var ps = this.vStart.subtract(vp)
     ,pe = this.vEnd.subtract(vp);

  return (this.getLength() == ps.getMagnitude() + pe.getMagnitude()); 
}

/**
* 两点是否在线段两侧
* @param {Point} 点p3
* @param {Point} 点p4
* @returns {boolen}
*/
Segment.prototype.isCrossTwoPoints = function(p3, p4){ 
  var p1p3v = new Vector(p3.x, p3.y).subtract(this.vStart)
     ,p1p4v = new Vector(p4.x, p4.y).subtract(this.vStart)
     ,p1p2v = this.vEnd.subtract(this.vStart);

  return (p1p2v.crossProduct(p1p3v) * p1p2v.crossProduct(p1p4v)) < 0;
}

/**
* 线段是否相交
* @param {Segment} 线段
* @returns {boolen}
*/
Segment.prototype.isCross = function(segment){ 
  var p3p4 = segment.getPoints()
     ,p1p2 = this.getPoints();
  return this.isCrossTwoPoints(p3p4.pointStart, p3p4.pointEnd) && segment.isCrossTwoPoints(p1p2.pointStart, p1p2.pointEnd);
}

var Polygon = function(){
  Shape.call(this);
  this.points = [];
}
Common.Base.inheritPrototype(Polygon, Shape);//继承自Shape;

Polygon.prototype.createPath = function(context){
  context.beginPath();
  var l = this.points.length;
  if(this.points === undefined || l == 0){ return;}
  context.moveTo(this.points[0].x, this.points[0].y);
  for (var i = 1; i < l; i++) {
     context.lineTo(this.points[i].x, this.points[i].y);
  };

  context.lineTo(this.points[0].x, this.points[0].y);
};

Polygon.prototype.getSegments = function(){//多边形线段集合
  var vvs = []//顶点向量
     ,segments = []//相邻顶点的线段，从起点开始
     ,l = this.points.length;
  if(this.points === undefined || l == 0) {return [];};
  
  for (var i = 0; i < l; i++) {
     vvs.push(new Vector(this.points[i].x, this.points[i].y));
  };

  for (var i= 0; i < l-1; i++) {
     segments.push(new Segment(vvs[i], vvs[i+1]));
  };
  segments.push(new Segment(vvs[l-1], vvs[0]));//终点到起点

  return segments;
}

/**
* 多边形放大或缩小
* @param {Number} 缩放倍数
* @returns {Polygon} 缩放后的多边形
*/
Polygon.prototype.scale = function(scale){
     var poly = new Polygon();
     var i,l = this.points.length;
     for(i=0;i<l;i++){
        poly.points.push(new Point(this.points[i].x * scale, this.points[i].y * scale));
     }

     return poly;
}

/**
* 多边形放大或缩小
* @param {Number} x缩放倍数
* @param {Number} y缩放倍数
*/
Polygon.prototype.scaleXY = function(xscale, yscale){
     var i,l = this.points.length;
     for(i=0;i<l;i++){
        this.points[i].x *= xscale;
        this.points[i].y *= yscale;
     }
}

/**
* 多边形平移
* @param {Number} 水平方向平移量
* @param {Number} 垂直方向平移量
* @returns {Polygon} 平移后的多边形
*/
Polygon.prototype.translate = function(h,v){
     var i,l = this.points.length;
     for(i=0;i<l;i++){
        this.points[i].x += h;
        this.points[i].y += v;
     }     
}

Polygon.prototype.setTransform = function(a,b,c,d,e,f, polygon){//绝对变换
     var i,l = this.points.length,ps = this.points;
     for(i=0;i<l;i++){
        ps[i].x = polygon.points[i].x * a;
        // this.points[i].x = rotate b;
        // this.points[i].y = polygon.points[i].y rotate c;
        ps[i].y = polygon.points[i].y * d;
        ps[i].x = ps[i].x + e;
        ps[i].y = ps[i].y + f;
     }
}

Polygon.prototype.transform = function(a,b,c,d,e,f){
	var l = this.points.length;
	for (var i = l - 1; i >= 0; i--) {
		this.points[i].x *= a;
		// 
		//
		this.points[i].y *= d;
		this.points[i].x += e;
		this.points[i].y += f; 
	};
};

/**
* 点是否在多边形内部
* @param {Segment} 点
* @returns {boolen}
*/
Polygon.prototype.isPointInside = function(point){
  var tSeg = new Segment(new Vector(point.x, point.y), new Vector(point.x, 10000));//平行于X轴的向量:待检测点到无穷远点;
  var segments = this.getSegments(),
     l = segments.length;
  var crossCount = 0;//tSeg与多边形的所有边相交的次数。
  for (var i = l-1; i >= 0; i--) {
     if(segments[i].isPointOn(point)){ return false; }//点在多边形边上则判定不在其内部!important.
     if((segments[i].getVector().crossProduct(new Vector(1, 0))) == 0){ continue; }//线段平行于X轴,不进行下一步检测

     if(tSeg.isCross(segments[i])){//两条线段相交, 则加1
        crossCount ++;
     }
  };

  return crossCount%2 != 0;//crossCount为奇数,则判定点在多边形内部。
}

Polygon.prototype.getAxes = function () {
var v1 = new Vector(),
   v2 = new Vector(),
   axes = [];
  
for (var i=0; i < this.points.length-1; i++) {
  v1.x = this.points[i].x;
  v1.y = this.points[i].y;

  v2.x = this.points[i+1].x;
  v2.y = this.points[i+1].y;

  axes.push(v1.edge(v2).normal());
}

v1.x = this.points[this.points.length-1].x;
v1.y = this.points[this.points.length-1].y;

v2.x = this.points[0].x;
v2.y = this.points[0].y;

axes.push(v1.edge(v2).normal());

return axes;
};

var Vector = function(x, y) {//向量
     this.x = x;
     this.y = y;
};

Vector.prototype = {
  getMagnitude: function () {
     return Math.sqrt(Math.pow(this.x, 2) +
                      Math.pow(this.y, 2));
  },

  add: function (vector) {
     var v = new Vector();
     v.x = this.x + vector.x;
     v.y = this.y + vector.y;
     return v;
  },

  subtract: function (vector) {
     var v = new Vector();
     v.x = this.x - vector.x;
     v.y = this.y - vector.y;
     return v;
  },

  dotProduct: function (vector) {
     return this.x * vector.x +
            this.y * vector.y;
  },

  crossProduct: function(vector){ //叉乘:为正时，this在vector的顺时针方向
     return this.x * vector.y - vector.x * this.y;
  }

};
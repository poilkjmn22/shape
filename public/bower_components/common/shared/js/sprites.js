/*
 * Copyright (C) 2012 David Geary. This code is from the book
 * Core HTML5 Canvas, published by Prentice-Hall in 2012.
 *
 * License:
 *
 * Permission is hereby granted, free of charge, to any person 
 * obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * The Software may not be used to create training material of any sort,
 * including courses, books, instructional videos, presentations, etc.
 * without the express written consent of David Geary.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
*/

// Painters...................................................................

// Painters paint sprites with a paint(sprite, context) method. ImagePainters
// paint an image for their sprite.

var ImagePainter = function (imageUrl) {
   this.image = new Image;
   this.image.src = imageUrl;
};

ImagePainter.prototype = {
   image: undefined,

   paint: function (sprite, context) {
      if (this.image !== undefined) {
         if ( ! this.image.complete) {
            this.image.onload = function (e) {
               //保存画布句柄状态
               context.save();

               //更改画布句柄的透明度,从这以后绘制的图像都会依据这个透明度
               context.globalAlpha=sprite.alpha;

               //设置画布句柄的位置,实际上是设置的图像的位置
               context.translate(sprite.xTranslation,sprite.yTranslation);

               //设置画布旋转角度实际上是设置了图像的角度,参数是弧度,所以我们必须把角度转换为弧度
               context.rotate(sprite.xAngle*Math.PI/180 || sprite.xRotation, sprite.yAngle*Math.PI/180 || sprite.yRotation);

               //设置画布句柄的比例,实际上是设置了图像的比例
               context.scale(sprite.xScale,sprite.yScale);
               sprite.width = this.width;
               sprite.height = this.height;
               
               context.drawImage(this,  // this is image
                  0,0,this.width, this.height,
                  - this.width >> 1, - this.height >> 1, this.width, this.height);
                context.restore();
            };
         }
         else {
           //保存画布句柄状态
           context.save();

           //更改画布句柄的透明度,从这以后绘制的图像都会依据这个透明度
           context.globalAlpha=sprite.alpha;

           //设置画布句柄的位置,实际上是设置的图像的位置
           context.translate(sprite.xTranslation,sprite.yTranslation);

           //设置画布旋转角度实际上是设置了图像的角度,参数是弧度,所以我们必须把角度转换为弧度
           context.rotate(sprite.xAngle*Math.PI/180 || sprite.xRotation, sprite.yAngle*Math.PI/180 || sprite.yRotation);

           //设置画布句柄的比例,实际上是设置了图像的比例
           context.scale(sprite.xScale,sprite.yScale);
           context.drawImage(this.image, 
            0, 0, sprite.width, sprite.height,
            - sprite.width >> 1, - sprite.height >> 1, sprite.width, sprite.height); 
           context.restore();
         }
      }
   }
};

SpriteSheetPainter = function (spritesheetUrl, cells) {
   this.spritesheet = new Image;
   this.spritesheet.src = spritesheetUrl;
   this.cells = cells;
};

SpriteSheetPainter.prototype = {
   cells: [],
   cellIndex: 0,

   advance: function (step) { //精灵表中前进步数.
      if (!step){ return this;}; 
      var tmp = this.cellIndex + step,
          l = this.cells.length,
          mod = tmp % l;
      this.cellIndex = tmp > (l - 1) ?  mod: tmp < 0 ? (mod + l) : tmp;
      return this;
   },
   
   paint: function (sprite, context) {
      if (this.spritesheet !== undefined) {
         var cell = this.cells[this.cellIndex];
         if ( ! this.spritesheet.complete) {
              this.spritesheet.onload = function (e) {
               //保存画布句柄状态
               context.save();

               //更改画布句柄的透明度,从这以后绘制的图像都会依据这个透明度
               context.globalAlpha=sprite.alpha;
 
               //设置画布句柄的位置,实际上是设置的图像的位置
               context.translate(sprite.xTranslation,sprite.yTranslation);

               //设置画布旋转角度实际上是设置了图像的角度,参数是弧度,所以我们必须把角度转换为弧度
               context.rotate(sprite.xAngle*Math.PI/180 || sprite.xRotation, sprite.yAngle*Math.PI/180 || sprite.yRotation);

               //设置画布句柄的比例,实际上是设置了图像的比例
               context.scale(sprite.xScale,sprite.yScale); 
               sprite.width = cell.width;           
               sprite.height = cell.height;           
               context.drawImage(this,  // this is spritesheet
                  cell.left,cell.top,cell.width, cell.height,
                  - cell.width >> 1, - cell.height >> 1, cell.width, cell.height);
                context.restore();
            };
         }
         else {
           //保存画布句柄状态
           context.save();

           //更改画布句柄的透明度,从这以后绘制的图像都会依据这个透明度
           context.globalAlpha=sprite.alpha;

           //设置画布句柄的位置,实际上是设置的图像的位置
           context.translate(sprite.xTranslation,sprite.yTranslation);

           //设置画布旋转角度实际上是设置了图像的角度,参数是弧度,所以我们必须把角度转换为弧度
           context.rotate(sprite.xAngle*Math.PI/180 || sprite.xRotation, sprite.yAngle*Math.PI/180 || sprite.yRotation);

           //设置画布句柄的比例,实际上是设置了图像的比例
           context.scale(sprite.xScale,sprite.yScale);
           context.drawImage(this.spritesheet, 
            cell.left,cell.top,cell.width, cell.height,
            - sprite.width >> 1, - sprite.height >> 1, sprite.width, sprite.height); 
           context.restore();
         }
      }
   }
};

// Sprite Animators...........................................................

// Sprite animators have an array of painters that they succesively apply
// to a sprite over a period of time. Animators can be started with 
// start(sprite, durationInMillis, restoreSprite)

var SpriteAnimator = function (painters, elapsedCallback) {
   this.painters = painters;
   if (elapsedCallback) {
      this.elapsedCallback = elapsedCallback;
   }
};

SpriteAnimator.prototype = {
   painters: [],
   duration: 1000,
   startTime: 0,
   index: 0,
   elapsedCallback: undefined,

   end: function (sprite, originalPainter) {
      sprite.animating = false;

      if (this.elapsedCallback) {
         this.elapsedCallback(sprite);
      }
      else {
         sprite.painter = originalPainter;
      }
   },
   
   start: function (sprite, duration) {
      var endTime = +new Date() + duration,
          period = duration / (this.painters.length),
          interval = undefined,
          animator = this, // for setInterval() function
          originalPainter = sprite.painter;

      this.index = 0;
      sprite.animating = true;
      sprite.painter = this.painters[this.index];

      interval = setInterval(function() {
         if (+new Date() < endTime) {
            sprite.painter = animator.painters[++animator.index];
         }
         else {
            animator.end(sprite, originalPainter);
            clearInterval(interval);
         }
      }, period); 
   }
};

// Sprites....................................................................

// Sprites have a name, a painter, and an array of behaviors. Sprites can
// be updated, and painted.
//
// A sprite's painter paints the sprite: paint(sprite, context)
// A sprite's behavior executes: execute(sprite, context, time)

var Sprite = function (name, painter, behaviors, config) {
   if (name !== undefined)      this.name = name;
   if (painter !== undefined)   this.painter = painter;
   if (behaviors !== undefined) this.behaviors = behaviors;
   // if (config !== undefined) {this.config = config;this.init();}
   if (config !== undefined) {this.config = config;}

   this.reset = function(){ //将Sprite的属性恢复为默认值
      for(var prop in this){
        delete this[prop];
      };
   };
   return this;
};

Sprite.prototype = {
   xScale : 1,
   xAngle : 0,
   yAngle : 0,
   xRotation:  0,
   yRotation:  0,
   yScale :1,
   xTranslation : 0,
   yTranslation : 0,
   width: 10,
   height: 10,
	 velocityX: 0,
	 velocityY: 0,
   alpha : 1,
   blend: "source-over",
   visible: true,
   animating: false,
   painter: undefined, // object with paint(sprite, context)
   behaviors: [], // objects with execute(sprite, context, time)

	paint: function (context) {
     if (this.painter !== undefined && this.visible) {
        this.painter.paint(this, context);
     }
	},

   update: function (context, time) {
      for (var i = this.behaviors.length; i > 0; --i) {
         this.behaviors[i-1].execute(this, context, time);
      }
   }
};

// Sprite.prototype.constructor = Sprite;

Sprite.prototype.init = function(){
  var cfg = this.config || {};
  this.xScale = cfg.xScale || 1;
  this.xAngle = cfg.xAngle || 0;
  this.yAngle = cfg.yAngle || 0;
  this.xRotation = cfg.xRotation || 0;
  this.yRotation = cfg.yRotation || 0;
  this.yScale = cfg.yScale || 1;
  this.xTranslation = cfg.xTranslation || 0;
  this.yTranslation = cfg.yTranslation || 0;
  this.alpha = cfg.alpha === undefined ? 1 : cfg.alpha;

  this.velocityX = cfg.velocityX || 0;
  this.velocityY = cfg.velocityY || 0;
  this.blend = cfg.blend || "souce-over";
};

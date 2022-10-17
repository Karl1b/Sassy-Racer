// This function extracts the 4 vectors of an Rectangle.
function extractVektors(object) {
    let vektor = [];
    let r = object.position.r * Math.PI / 180;
    let v1 = {
        x: object.position.x + Math.cos(r + Math.atan2(object.size.y, object.size.x)) * object.size.z * 0.5,
        y: object.position.y + Math.sin(r + Math.atan2(object.size.y, object.size.x)) * object.size.z * 0.5
    };
    let v2 = {
        x: object.position.x + Math.cos(r - Math.atan2(object.size.y, object.size.x) + Math.PI) * object.size.z * 0.5,
        y: object.position.y + Math.sin(r - Math.atan2(object.size.y, object.size.x) + Math.PI) * object.size.z * 0.5
    };
    let v3 = {
        x: object.position.x + Math.cos(r + Math.atan2(object.size.y, object.size.x) + Math.PI) * object.size.z * 0.5,
        y: object.position.y + Math.sin(r + Math.atan2(object.size.y, object.size.x) + Math.PI) * object.size.z * 0.5
    };
    let v4 = {
        x: object.position.x + Math.cos(r - Math.atan2(object.size.y, object.size.x)) * object.size.z * 0.5,
        y: object.position.y + Math.sin(r - Math.atan2(object.size.y, object.size.x)) * object.size.z * 0.5
    };
    vektor.push(v1, v2, v3, v4);
return vektor;
}

// This function finds the normal Axis of n vektors.
function findAxis(vektors) {
    let Axis = [];
    for (let i = 0; i < vektors.length; i++) {
        let v = {
            x: -(vektors[(i + 1) % vektors.length].y - vektors[i].y),
            y: vektors[(i + 1) % vektors.length].x - vektors[i].x
        };
        Axis.push(v);
    }
    return Axis;
}

// This function finds the min and Max Value of a Vector projection
function findBorders(vektors, axis) {
    let result = [];
    for (let k = 0; k < axis.length; k++) {
        let min_max = {
            min: Number.MAX_VALUE,
            max: -Number.MAX_VALUE
        };
        for (let i = 0; i < vektors.length; i++) {
            let value = vektors[i].x * axis[k].x + vektors[i].y * axis[k].y;
            if (value > min_max.max) { min_max.max = value; }
            if (value < min_max.min) { min_max.min = value; }
 }
        result.push(min_max);
}
    return result;
}
// This function checks if there is a gap in two border projections from two different Vector projections of the same Axis.
function isthereagap(min_max1, min_max2) {
    for (let i = 0; i < min_max1.length; i++) {
        if (
            min_max1[i].max < min_max2[i].min ||
            min_max2[i].min > min_max1[i].max
        ) {
            return true;
        }
    }
    return false;
}

function isInCollisionRange(obj1,obj2){
   if(( 
        obj1.position.x + obj1.size.z * 0.5 < obj2.position.x - obj2.size.z * 0.5 ||
        obj1.position.x - obj1.size.z * 0.5 > obj2.position.x + obj2.size.z * 0.5
    )){
        //console.log("false on X check!");
        return false;
    }

    if(( 
        obj1.position.y + obj1.size.z * 0.5 < obj2.position.y - obj2.size.z * 0.5 ||
        obj1.position.y - obj1.size.z * 0.5 > obj2.position.y + obj2.size.z * 0.5
    )){
        //console.log("false on Y check!");
        return false;
    }
  return true;
}


export function myDraw(ctx, object) {

    let drawX = object.position.x - object.game.position.x + object.game.gameWidth * 0.5;
    let drawY = object.position.y - object.game.position.y + object.game.gameHeight * 0.5;
    let r = object.position.r * Math.PI / 180;

    ctx.translate(drawX, drawY);
    ctx.rotate(r)
    ctx.beginPath();
    ctx.lineWidth = object.lineWidth;
    ctx.strokeStyle = object.color;
    ctx.rect(-object.size.x * 0.5, -object.size.y * 0.5, object.size.x, object.size.y);
    ctx.stroke();
    ctx.rotate(-r)
    ctx.translate(-drawX, -drawY);

}

export function myDrawImg(ctx, object) {

    let drawX = object.position.x - object.game.position.x + object.game.gameWidth * 0.5;
    let drawY = object.position.y - object.game.position.y + object.game.gameHeight * 0.5;
    let r = object.position.r * Math.PI / 180;

    ctx.translate(drawX, drawY);
    ctx.rotate(r)
    ctx.drawImage(object.img, - object.size.x * 0.5, - object.size.y * 0.5);
    ctx.rotate(-r)
    ctx.translate(-drawX, -drawY);

}

export function detectInside(car, gameObject) {
    let r = (gameObject.position.r - car.position.r) * Math.PI / 180;
    let sizeX = Math.abs(Math.cos(r) * car.size.x * 0.5) + Math.abs(Math.sin(r) * car.size.y * 0.5);
    let sizeY = Math.abs(Math.sin(r) * car.size.x * 0.5) + Math.abs(Math.cos(r) * car.size.y * 0.5);

    if (
        car.position.x - sizeX > gameObject.position.x - gameObject.size.x * 0.5 &&
        car.position.x + sizeX < gameObject.position.x + gameObject.size.x * 0.5 &&
        car.position.y - sizeY > gameObject.position.y - gameObject.size.y * 0.5 &&
        car.position.y + sizeY < gameObject.position.y + gameObject.size.y * 0.5
    ) {
        //console.log("car inside!")
        return true;

    } else {
        //console.log("car outside!");
        return false;
    }
}

export function detectCollision(car, gameObject) {
    // Checks if exact collision detection is needed with a bigger box.
    if (!isInCollisionRange(car,gameObject)){return false;}

    
    // Fine Check with SAT - collision detction. 
    let vektors1 = extractVektors(car);
    let vektors2 = extractVektors(gameObject);
    let axis1 = findAxis(vektors1);
    let axis2 = findAxis(vektors2);
    let min_max1 = findBorders(vektors1, axis1);
    let min_max2 = findBorders(vektors2, axis1);
    if (isthereagap(min_max1, min_max2)) {    
        return false;
    }
    min_max1 = findBorders(vektors1, axis2);
    min_max2 = findBorders(vektors2, axis2);
    if (isthereagap(min_max1, min_max2)) {

        return false;
    }
    return true;
}

export function detectLevelCollision(levelsize, gameObject) {

    let r = (gameObject.position.r) * Math.PI / 180;

    let sizeX = (gameObject.size.x + Math.abs(Math.sin(r)) * (gameObject.size.z - gameObject.size.x)) * 0.5;
    let sizeY = (gameObject.size.y + Math.abs(Math.cos(r)) * (gameObject.size.z - gameObject.size.y)) * 0.5;

    if (
        sizeX + gameObject.position.x > levelsize.x ||
        gameObject.position.x - sizeX < 0 ||
        sizeY + gameObject.position.y > levelsize.y ||
        gameObject.position.y - sizeY < 0

    ) {
        return true;
    } else { return false; }

}


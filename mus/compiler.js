var endTime = function(time, expr) {
   if(expr.tag === 'seq')
       return arguments.callee(arguments.callee(time, expr.left), expr.right);
   if(expr.tag == 'par'){
       var lT = arguments.callee(time, expr.left),
           rT = arguments.callee(time, expr.right);
       return lT > rT ? lT : rT;
   }
   else
       return time + (expr.dur || expr.duration || 0);
};

// maybe some helper functions
var compileT = function(time,expr) {
    if(expr.tag === 'seq'){
        return [].concat(
            arguments.callee(time, expr.left),
            arguments.callee(endTime(time, expr.left), expr.right)
        );
    }
    if(expr.tag === 'par') {
        return [].concat(
            arguments.callee(time, expr.left),
            arguments.callee(time, expr.right)
        );
    }
	else {
        expr.start = time;
        return expr;
    }
};

var compile = function (musexpr) {
    return compileT(0, musexpr);
};


var melody_mus = {
	tag: 'seq',
	left: {
		tag:'seq',
		left:  { tag: 'seq',
			left: {tag: 'note', pitch:'a4', dur: 250},
			right: {tag: 'rest', duration: 300}
		},
		right: {tag: 'note', pitch: 'b4', dur: 250}
	},
	right: {
		tag:'par',
		left:  {tag: 'note', pitch:'a4', dur: 500},
		right: {tag: 'note', pitch: 'b4', dur: 250}
	}
}

console.log(melody_mus)
console.log(compile(melody_mus))

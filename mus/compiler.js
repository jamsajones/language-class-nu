(function(){

var clone = function(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for(var key in obj)
        temp[key] = clone(obj[key]);
    return temp;
}


var end_time = function(time, expr) {
  var end = 0
  console.log(time)
	switch (expr.tag){
    case 'seq':
      end = arguments.callee(arguments.callee(time, expr.left), expr.right)
      break
    case 'par':
      var lT = arguments.callee(time, expr.left),
          rT = arguments.callee(time, expr.right)
      end = lT > rT ? lT : rT
      break
    case 'repeat':
      end = time + (arguments.callee(0, expr.section) * expr.count)
      break
    default:
        end = time + (expr.dur || expr.duration || 0)
	}
  return end
}

// maybe some helper functions
var notes = {
	'C': 0,
  'Cs':1,
	'D': 2,
  'Ds': 3,
	'E': 4,
	'F': 5,
  'Fs': 6,
	'G': 7,
  'Gs': 8,
	'A': 9,
  'As': 10,
	'B': 11,
}

var convert_pitch = function(pitch){	
	// the zero octive starts at 16...
  if(pitch === undefined)
    return 0
    console.log(pitch)
	var note = pitch[0].toUpperCase(),
		oct = pitch[1]
	return 12 + notes[note] + (12 * parseInt(oct))
}

var convert = function(time,expr) {
	var r = []
	switch(expr.tag) {
	    case 'seq':
	        r = [].concat(
	            arguments.callee(time, expr.left),
	            arguments.callee(end_time(time, expr.left), expr.right)
	        )
			break
		case 'par':
			r = [].concat(
	            arguments.callee(time, expr.left),
	            arguments.callee(time, expr.right)
	        )
			break
		case "note":
		case "rest":
			r = {
        tag: expr.tag,
        start: time,
        pitch: convert_pitch(expr.pitch),
        dur: expr.dur || expr.duration
      }
			break
    case "repeat":
      for (var i=0; i < expr.count; i++){ r.push(arguments.callee(time + (end_time(0, expr.section) * i), expr.section)) }
      break
		default:
			throw "You have a syntax error: tag '" + expr.tag + "' not supported."
	}
	return r

}

var compile = function (musexpr) {
    return convert(0, musexpr)
}


var melody_mus = {
	tag: 'seq',
	left: {
		tag:'seq',
		left:  { tag: 'seq',
			left: {tag: 'note', pitch:'a0', dur: 250},
			right: {tag: 'rest', duration: 300}
		},
		right: {
		 tag:'repeat',
     section: {tag: 'note', pitch: 'c8', dur: 250},
     count: 3
		}
	},
	right: {
		tag:'par',
		left:  {tag: 'note', pitch:'a4', dur: 500},
		right: {tag: 'note', pitch: 'b4', dur: 250}
	}
}

console.log(melody_mus)
console.log(compile(melody_mus))
})()
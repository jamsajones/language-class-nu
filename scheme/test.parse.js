

describe('parse', function(){
  
  var parse = undefined;

  before(function(){
    parse = PEG.buildParser(lang).parse;
  });

  it('should parse correctly', function(){
    expect(typeof parse).to.eql('function');
  });

  it('should parse empty',function(){
      expect(parse(" ")).to.eql(undefined);
  });

  it('should parse atom', function(){
    expect(parse("atom")).to.eql("atom");
  });

  it('should parse (+)', function(){
    expect(parse('(+)')).to.eql(['+']);
  });

  it('should parse (+ x 3)', function(){
    expect(parse('(+ x 3)')).to.eql(["+", "x", "3"]);
  });
  
  it('should parse (+ 1 (f x 3 y))',function(){
    expect(parse("(+ 1 (f x 3 y))")).to.eql(["+", "1", ["f", "x", "3", "y"]]);
  });
  
  it('should parse newlines correctly',function(){
    expect(parse("(+ 1 \n(f x 3 y))")).to.eql(["+", "1", ["f", "x", "3", "y"]]);
  });

  it('should ignore empty lines', function(){
    expect(parse("(+ 1 \n\n\n(f x 3 y))")).to.eql(["+", "1", ["f", "x", "3", "y"]]);
  });
  it('should parse tabs correctly', function(){
    expect(parse("(+ 1 \t\t(f x 3 y))")).to.eql(["+", "1", ["f", "x", "3", "y"]]);
  });

  it('should parse spaces correctly', function(){
    expect(parse("(+ 1   (f x 3 y))")).to.eql(["+", "1", ["f", "x", "3", "y"]]);
  });

  it('should parse \' to quote for a list', function(){
    expect(parse("'(a b c)")).to.eql(["quote", ["a", "b", "c"]]);
  });

  it('should parse \' to quote for a atom', function(){
    expect(parse("'file.txt")).to.eql(["quote", "file.txt"]);
  });

  it('should ignore comments ;;', function(){
    expect(parse("(+ 1 \n;;Comment\n2);;one\n;; Comment")).to.eql(["+", "1", "2"]);
  });
})
        
        
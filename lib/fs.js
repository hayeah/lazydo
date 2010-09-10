var _fs = require('fs');
var Do = require("../lazydo").Do;

var sys = require('sys');

function p(o) {
  sys.puts(sys.inspect(o));
}


module.exports = {
  mkdir: function(path,mode) {
    return Do(function($) {
      _fs.mkdir(path,mode,function(err) {
        err ? $.raise(err) : $.return(true);
      });
    });
  },

  rmdir: function(path) {
    return Do(function($) {
      _fs.rmdir(path,function(err) {
        err ? $.raise(err) : $.return(true);
      });
    });
  },
  
  stat: function(path) {
    return Do(function($) {
      _fs.stat(path,function(err,result) {
        err ? $.raise(err) : $.return(result);
      });
    });
  },
  
  rename: function(path1,path2) {
    return Do(function($) {
      _fs.rename(path1,path2,function(err) {
        err ? $.raise(err) : $.return(true);
      });
    });
  },

  open: function(path, flags, mode) {
    return Do(function($) {
      _fs.open(path, flags, mode,function(err,fd) {
        err ? $.raise(err) : $.return(fd);
      });
    });
  },
  

  fstat: function(fd) {
    return Do(function($) {
      _fs.fstat(fd,function(err,result) {
        err ? $.raise(err) : $.return(result);
      });
    });
  },
  //fstat
  //lstat

  realpath: function(path) {
    return Do(function($) {
      _fs.realpath(path,function(err) {
        err ? $.raise(err) : $.return(true);
      });
    });
  },

  readFile: function(filename,encoding) {
    return Do(function($) {
      _fs.readFile(filename,encoding,function(err,data) {
        err ? $.raise(err) : $.return(data);
      });
    });
  },
  
  write: function() {
    // return Apply(_fs.write,arguments);
    var args = [].slice.call(arguments,0);
    return Do(function($) {
      args.push(function(err,written) {
        err ? $.raise(err) : $.return(written);
      });
      _fs.write.apply(_fs,args);
    });
  },

  read: function() {
    var args = [].slice.call(arguments,0);
    return Do(function($) {
      args.push(function(err,written) {
        err ? $.raise(err) : $.return(written);
      });
      _fs.read.apply(_fs,args);
    });
  },

  truncate: function(fd,len) {
    return Do(function($) {
      _fs.truncate(fd,len,function(err) {
        err ? $.raise(err) : $.return(true);
      });
    });
  },

  close: function(fd) {
    return Do(function($) {
      _fs.close(fd,function(err) {
        err ? $.raise(err) : $.return(true);
      });
    });
  },

  
  
};

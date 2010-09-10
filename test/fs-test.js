var Do = require("../lazydo").Do,
fs = require("../lib/fs"),
_fs = require('fs');

var ENOENT = 2,
EEXIST = 17,
EBADF = 9;

sys = require('sys');
function p(o) {
  sys.puts(sys.inspect(o));
}

var test_dir = "test/fs";

function dir(path) {
  try {
    _fs.mkdirSync(path,0755);
  } catch(e) {
    if(e.errno != EEXIST) { throw(e) };
  };
}

function nodir(path) {
  try {_fs.rmdirSync(path);} catch(e) {};
}

function file(path,content) {
  try {
    var fd = _fs.openSync(path,"a+",0644);
    if(typeof content ==  'string') {
      _fs.writeSync(fd,content,0,"ascii");
      _fs.truncateSync(fd,content.length);
    }
    _fs.closeSync(fd);
  } catch(e) {
    if(e.errno != EEXIST) { throw(e) };
  }
}

function nofile(path) {
  try {
    _fs.unlink(path);
  } catch(e) {};
}



dir(test_dir);
file("foo","abcde");

module.exports = {
  'mkdir': function(a,wait) {
    var path = test_dir+"/mkdir-ok";
    nodir(path);
    Do(fs.mkdir(path,0755))(function(result) {
      a.isUndefined(this.error);
      a.ok(_fs.statSync(path).isDirectory());
    });
  },

  'mkdir raises error': function(a,wait) {
    var path = test_dir+"/mkdir-err";
    dir(path);
    Do(fs.mkdir(path,0755))(function(result) {
      a.isDefined(this.error);
    });
  },

  'rmdir': function(a) {
    var path = test_dir+"/rmdir-ok";
    dir(path)
    Do(fs.rmdir(path))(function() {
      a.isUndefined(this.error);
      a.throws(function() {
        _fs.statSync(path);
      });
    });
  },
  
  'rmdir raises error': function(a) {
    var path = test_dir+"/rmdir-error";
    nodir(path);
    Do(fs.rmdir(path))(function() {
      a.isDefined(this.error);
    });
  },

  'stat succeeds': function(a) {
    var path = test_dir + "/stat-ok";
    dir(path);
    Do(fs.stat(path))(function(stat) {
      a.isUndefined(this.error);
      a.ok(stat.isDirectory());
    });
  },

  'stat fails': function(a) {
    var path = test_dir + "/stat-error";
    nodir(path);
    Do(fs.stat(path))(function(stat) {
      a.isDefined(this.error);
      a.eql(this.error.errno,ENOENT);
    });
  },

  'rename': function(a) {
    var path = test_dir + "/rename";
    var path2 = test_dir + "/rename"+"2";
    dir(path);
    nodir(path2);
    Do(fs.rename(path,path2))(function(stat) {
      a.isUndefined(this.error);
      a.throws(function(){
        _fs.statSync(path);
      });
      a.ok(_fs.statSync(path2).isDirectory());
    });
  },
  
  'rename fails': function(a) {
    var path = test_dir + "/rename-error";
    nodir(path);
    Do(fs.rename(path,path+"2"))(function(stat) {
      a.isDefined(this.error);
    });
  },

  'open': function(a) {
    var path = test_dir+"/open-ok";
    Do(fs.open(path,"w"))(function(fd) {
      a.isUndefined(this.error);
      a.ok(typeof fd == 'number' );
      _fs.closeSync(fd);
    });
  },
  
  'open fails': function(a) {
    var path = test_dir+"/open-error";
    Do(fs.open(path,"r"))(function() {
      a.isDefined(this.error);
      a.eql(this.error.errno,ENOENT);
    });
  },

  'write': function(a) {
    var path = test_dir+"/write-ok";
    var file = fs.open(path,"w");
    Do(fs.write,file,"abc",0,"ascii")(function(bytes) {
      a.eql(bytes,3);
    });
  },
  
  'write fails': function(a) {
    var path = test_dir+"/write-error";
    Do(fs.write,321,"abc",0,"ascii")(function(bytes) {
      a.isDefined(this.error);
      a.eql(this.error.errno,EBADF);
    });
  },

  'truncate fails': function(a) {
    var path = test_dir+"/truncate-error";
    Do(fs.truncate,321,0)(function() {
      a.isDefined(this.error);
      a.eql(this.error.errno,EBADF);
    });
  },

  'truncate': function(a) {
    var path = test_dir+"/truncate-ok";
    file(path,"abc");
    var fd = fs.open(path,"w");
    Do(Do(fs.truncate,fd,0),
       Do(fs.stat,path))(function(success,stat) {
         a.ok(success);
         a.isUndefined(this.error);
         a.eql(stat.size,0);
       });
  },

  'close': function(a) {
    var path = test_dir + "/open-ok";
    Do(fs.close,fs.open(path,"r"))(function() {
      a.isUndefined(this.error);
    });
  },
  
  'close fails': function(a) {
    Do(fs.close,1234)(function() {
      a.isDefined(this.error);
      a.eql(this.error.errno,EBADF);
    });
  },

  'read': function(a) {
    var path = test_dir + "/read-ok";
    file(path,"abc");
    var fd = fs.open(path,"r");
    Do(Do(fs.read,fd,3,0,"ascii"),
       Do(fs.close,fd))(function(data) {
         a.isUndefined(this.error);
         a.eql(data,"abc");
    });
  },
  
  'read fails': function(a) {
    Do(fs.read,1234,10,0,"ascii")(function() {
      a.isDefined(this.error);
      a.eql(this.error.errno,EBADF);
    });
  },

}

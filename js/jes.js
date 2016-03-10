var JES = function(args) {
    //基础库
    function selFind(selector) {
        var Qfor = function(arr, fun){
			for (var i = 0;i < arr.length; i++) {
				if (fun(i, arr[i]) === false) break;
			}	
		},
		getId = function(id) {
            return document.getElementById(id);
        }, //获取CLASS节点数组
        getClass = function(cls, parentNode) {
            var node = null, temps = [];
            node = parentNode != undefined ? parentNode :document;
            var clsall = node.getElementsByTagName("*");
			Qfor(clsall,function(i,cell){
                //遍历所有节点，判断是否有包含className
                if (new RegExp("(\\s|^)" + cls + "(\\s|$)").test(cell.className)) temps.push(cell);
            })
            return temps;
        }, //获取TAG节点数组
        getTagName = function(tag, parentNode) {
            var node = null, temps = [], regs = /\[(.+?)\]/g, 
			tagA = tag.indexOf(".") != -1, tagB = tag.indexOf("=") != -1,
			tagCls = tagB ? tag.split('[') :tag.split(".");
            node = parentNode != undefined ? parentNode :document;
            var tags = node.getElementsByTagName(tagCls[0]);
            if ((tagA && tagCls[1] != undefined) || tagB) {
                var clsn = tagA ? tagCls[1] :tag.match(regs)[0].replace(regs, "$1").split("="), 
				clas = /MSIE (6|7)/i.test(navigator.userAgent) ? "className" :"class", 
				atts = tagA ? clas :clsn[0], clsof = tag.indexOf(".") != -1 ? clsn :clsn[1];   
				Qfor(tags,function(i,cell){
                    if (cell.getAttribute(atts).indexOf(clsof) != -1) temps.push(cell);
                })
            } else {
				Qfor(tags,function(i,cell){ temps.push(cell); })
            }
            return temps;
        };
        //创建一个数组，用来保存获取的节点或节点数组
        var thatElem = this.elements = [];
        //当参数是一个字符串，说明是常规css选择器，不是this,或者function
        if (typeof selector == "string") {
            selector = selector.replace(/(^\s*)|(\s*$)/g, "");
            //css模拟，就是跟CSS后代选择器一样
            var sj = /\s+/g, args = selector.indexOf(">") != -1 ? selector.replace(/([ \t\r\n\v\f])*>([ \t\r\n\v\f])*/g, ">").replace(/\>/g, " ").replace(sj, " ") :selector.replace(sj, " ");
            if (args.indexOf(",") > -1) {
                var spl = args.split(/,/g), len = spl.length;
                for (var idx = 0; idx < len; ++idx) thatElem = thatElem.concat(selFind(spl[idx]));
            }else if (args.indexOf(" ") != -1) {
                //把节点拆分开并保存在数组里
                var elements = args.split(" ");
                //存放临时节点对象的数组，解决被覆盖问题
                var tempNode = [], node = [];
                //用来存放父节点用的
				Qfor(elements,function(i,elems){
                    //如果默认没有父节点，就指定document
                    if (node.length == 0) node.push(document);
					var elmSub = elems.substring(1)
					tempNode = [];
                    switch (elems.charAt(0)) {
                      //id
                        case "#":
                        //先清空临时节点数组
                        tempNode.push(getId(elmSub));
                        node = tempNode;
                        //保存到父节点
                        break;

                      //类
                        case ".":
                        //遍历父节点数组，匹配符合className的所有节点
						Qfor(node,function(j,nd){
							Qfor(getClass(elmSub, nd),function(k,tp){ tempNode.push(tp); })
                        })
                        node = tempNode;
                        break;

                      //标签
                        default:
						Qfor(node,function(j,nd){
                            Qfor(getTagName(elems, nd),function(k,tp){tempNode.push(tp); })
                        })
                        node = tempNode;
                    }
                })
                thatElem = tempNode;
            } else {
                //find模拟,就是说只是单一的选择器
				var argSub = args.substring(1);
                switch (args.charAt(0)) {
                  case "#":
                    thatElem.push(getId(argSub));
                    break;

                  case ".":
                    thatElem = getClass(argSub);
                    break;

                  default:
                    thatElem = getTagName(args);
                }
            }
        } else if (typeof args == "Object") {
            if (args != undefined) {
                thatElem[0] = args;
            }
        }
        return thatElem;
    }
    var $query = function(args) {
        return new selFind(args);
    };
    return $query;
}();

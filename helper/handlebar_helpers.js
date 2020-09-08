module.exports = {

    ifEquals: function(a, b, options){
      if (a === b) {
        return options.fn(this);
        }
      return options.inverse(this);
    },
    ifContains: function(a,b,options){
      if(a[b]){
        return options.fn(this)
      }
      return options.inverse(this);
    },
    valueForKey: function(array, key){
      return array[key]
    },
    select: function(value, options){
        return options.fn(this)
            .split('\n')
            .map(function(v) {
            var t = 'value="' + value + '"'
            return ! RegExp(t).test(v) ? v : v.replace(t, t + ' selected="selected"')
            })
            .join('\n')
    },

    multiselect: function(selected, options){
      
      var html = options.fn(this);
      selected.forEach(selected=>{
        html = html.replace(new RegExp(' lb-selected=\"' + selected._id + '\"'), '$& selected="selected"')
      })
      return html;
  },

    admultiselect: function(selected, options){
        console.log(selected);
        var html = options.fn(this);
        //selected = selected[0];
        selected.forEach(selected=>{
          selected = escape(selected);
          html = html.replace(new RegExp(' lb-selected=\"' + selected + '\"'), '$& selected="selected"')
        })
        return html;
    },

    escape: function(str){
      return escape(str);
    },

    forEach: function(context, options){
      var ret = "";
        for(var prop in context)
        {
            ret = ret + options.fn({key:prop, value:context[prop]});
        }
        return ret;
    },
    forEachValue(array,key,options){
      var ret = "";
      for(var prop in array){
        if(prop == key){
          ret = ret + options.fn({key:prop, value:array[prop]});
        }
      }
      return ret;
    },
    capitalize: function(str){
      return str.toUpperCase();
    },
    valueFromArray: function(str, array){
      console.log(array);
      var arr = JSON.stringify(array);
      return arr[str];
    },

    json: function(context, key){
      return context[key];
    },

    jsHelper: function(context){
      if(context){
        return JSON.stringify(context);
      } else {
        return null;
      }
      
    },

    ifCond: function(v1, operator, v2, options){
      switch (operator)
        {
            case "==":
                return (v1==v2)?options.fn(this):options.inverse(this);

            case "!=":
                return (v1!=v2)?options.fn(this):options.inverse(this);

            case "===":
                return (v1===v2)?options.fn(this):options.inverse(this);

            case "!==":
                return (v1!==v2)?options.fn(this):options.inverse(this);

            case "&&":
                return (v1&&v2)?options.fn(this):options.inverse(this);

            case "||":
                return (v1||v2)?options.fn(this):options.inverse(this);

            case "<":
                return (v1<v2)?options.fn(this):options.inverse(this);

            case "<=":
                return (v1<=v2)?options.fn(this):options.inverse(this);

            case ">":
                return (v1>v2)?options.fn(this):options.inverse(this);

            case ">=":
            return (v1>=v2)?options.fn(this):options.inverse(this);

            default:
                return eval(""+v1+operator+v2)?options.fn(this):options.inverse(this);
        }
    },

    removeSpaces: function(str){
      return str.replace(/ /g,'');
    }

  }
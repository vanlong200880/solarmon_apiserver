'use strict';

var fs = require('fs');
var HTML = require('html-parse-stringify2');
var sqlFormatter = require("sql-formatter");
var convert = require('./lib/convert');
var myBatisMapper = {};

function MybatisMapper() {}

MybatisMapper.prototype.createMapper = function (xmls) {
  var queryTypes = ['sql', 'select', 'insert', 'update', 'delete'];

  // Parse each XML files
  for (var i = 0, xml; xml = xmls[i]; i++) {
    try {
      var rawText = this.replaceCdata(fs.readFileSync(xml).toString());
      var mappers = HTML.parse(rawText);
    } catch (err) {
      throw new Error("Error occured during open XML file [" + xml + "]");
    }

    try {
      for (var j = 0, mapper; mapper = mappers[j]; j++) {
        // Mapping <mapper> tag recursively
        this.findMapper(mapper);
      }
    } catch (err) {
      throw new Error("Error occured during parse XML file [" + xml + "]");
    }
  }
};

MybatisMapper.prototype.findMapper = function (children) {
  var queryTypes = ['sql', 'select', 'insert', 'update', 'delete'];

  if (children.type == 'tag' && children.name == 'mapper') {
    // Add Mapper
    myBatisMapper[children.attrs.namespace] = {};

    for (var j = 0, sql; sql = children.children[j]; j++) {
      if (sql['type'] == 'tag' && queryTypes.indexOf(sql['name']) > -1) {
        myBatisMapper[children.attrs.namespace][sql.attrs.id] = sql.children;
      }
    }
    return;
  } else {
    // Recursive to next children
    if (children['children'] != null && children['children'].length > 0) {
      for (var j = 0, nextChildren; nextChildren = children.children[j]; j++) {
        this.findMapper(nextChildren);
      }
    } else {
      return;
    }
  }
};

MybatisMapper.prototype.replaceCdata = function (rawText) {
  var cdataRegex = new RegExp('(<!\\[CDATA\\[)([\\s\\S]*?)(\\]\\]>)', 'g');
  var matches = rawText.match(cdataRegex);

  if (matches != null && matches.length > 0) {
    for (var z = 0; z < matches.length; z++) {
      var regex = new RegExp('(<!\\[CDATA\\[)([\\s\\S]*?)(\\]\\]>)', 'g');
      var m = regex.exec(matches[z]);

      var cdataText = m[2];
      cdataText = cdataText.replace(/\&/g, '&amp;');
      cdataText = cdataText.replace(/\</g, '&lt;');
      cdataText = cdataText.replace(/\>/g, '&gt;');
      cdataText = cdataText.replace(/\"/g, '&quot;');

      rawText = rawText.replace(m[0], cdataText);
    }
  }

  return rawText;
};

MybatisMapper.prototype.getStatement = function (namespace, sql, param, format) {
  var statement = '';

  // Parameter Check
  if (namespace == null) throw new Error('Namespace should not be null.');
  if (myBatisMapper[namespace] == undefined) throw new Error('Namespace [' + namespace + '] not exists.');
  if (sql == null) throw new Error('SQL ID should not be null.');
  if (myBatisMapper[namespace][sql] == undefined) throw new Error('SQL ID [' + sql + '] not exists');

  try {
    for (var i = 0, children; children = myBatisMapper[namespace][sql][i]; i++) {
      // Convert SQL statement recursively
      statement += convert.convertChildren(children, param, namespace, myBatisMapper);
    }

    if (format != undefined && format != null) {
      statement = sqlFormatter.format(statement, format);
    }
  } catch (err) {
    throw err;
  }
  statement = statement.replace(/: =/g, ":=");
  return statement;
};

MybatisMapper.prototype.getMapper = function () {
  return myBatisMapper;
};

module.exports = new MybatisMapper();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9EQk1hbmFnZXJzL015QmF0aXMvbXliYXRpcy1ub2RlL3NyYy9teWJhdGlzLW1hcHBlci9pbmRleC5qcyJdLCJuYW1lcyI6WyJmcyIsInJlcXVpcmUiLCJIVE1MIiwic3FsRm9ybWF0dGVyIiwiY29udmVydCIsIm15QmF0aXNNYXBwZXIiLCJNeWJhdGlzTWFwcGVyIiwicHJvdG90eXBlIiwiY3JlYXRlTWFwcGVyIiwieG1scyIsInF1ZXJ5VHlwZXMiLCJpIiwieG1sIiwicmF3VGV4dCIsInJlcGxhY2VDZGF0YSIsInJlYWRGaWxlU3luYyIsInRvU3RyaW5nIiwibWFwcGVycyIsInBhcnNlIiwiZXJyIiwiRXJyb3IiLCJqIiwibWFwcGVyIiwiZmluZE1hcHBlciIsImNoaWxkcmVuIiwidHlwZSIsIm5hbWUiLCJhdHRycyIsIm5hbWVzcGFjZSIsInNxbCIsImluZGV4T2YiLCJpZCIsImxlbmd0aCIsIm5leHRDaGlsZHJlbiIsImNkYXRhUmVnZXgiLCJSZWdFeHAiLCJtYXRjaGVzIiwibWF0Y2giLCJ6IiwicmVnZXgiLCJtIiwiZXhlYyIsImNkYXRhVGV4dCIsInJlcGxhY2UiLCJnZXRTdGF0ZW1lbnQiLCJwYXJhbSIsImZvcm1hdCIsInN0YXRlbWVudCIsInVuZGVmaW5lZCIsImNvbnZlcnRDaGlsZHJlbiIsImdldE1hcHBlciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsS0FBS0MsUUFBUSxJQUFSLENBQVQ7QUFDQSxJQUFJQyxPQUFPRCxRQUFRLHVCQUFSLENBQVg7QUFDQSxJQUFJRSxlQUFlRixRQUFRLGVBQVIsQ0FBbkI7QUFDQSxJQUFJRyxVQUFVSCxRQUFRLGVBQVIsQ0FBZDtBQUNBLElBQUlJLGdCQUFnQixFQUFwQjs7QUFFQSxTQUFTQyxhQUFULEdBQXlCLENBRXhCOztBQUVEQSxjQUFjQyxTQUFkLENBQXdCQyxZQUF4QixHQUF1QyxVQUFTQyxJQUFULEVBQWU7QUFDcEQs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RztBQUNELFNBQUssSUFBSWxCLElBQUksQ0FBUixFQUFXYSxRQUFoQixFQUEwQkEsV0FBV25CLGNBQWN1QixTQUFkLEVBQXlCQyxHQUF6QixFQUE4QmxCLENBQTlCLENBQXJDLEVBQXVFQSxHQUF2RSxFQUE0RTtBQUMxRTtBQUNBb0MsbUJBQWEzQyxRQUFRNkMsZUFBUixDQUF3QnpCLFFBQXhCLEVBQWtDcUIsS0FBbEMsRUFBeUNqQixTQUF6QyxFQUFvRHZCLGFBQXBELENBQWI7QUFDRDs7QUFFRCxRQUFJeUMsVUFBVUUsU0FBVixJQUF1QkYsVUFBVSxJQUFyQyxFQUEwQztBQUN4Q0Msa0JBQVk1QyxhQUFhMkMsTUFBYixDQUFvQkMsU0FBcEIsRUFBK0JELE1BQS9CLENBQVo7QUFDRDtBQUNGLEdBVEQsQ0FTRSxPQUFPM0IsR0FBUCxFQUFZO0FBQ1osVUFBTUEsR0FBTjtBQUNEO0FBQ0Q0QixjQUFZQSxVQUFVSixPQUFWLENBQWtCLE1BQWxCLEVBQTBCLElBQTFCLENBQVo7QUFDQSxTQUFPSSxTQUFQO0FBQ0QsQ0F2QkQ7O0FBeUJBekMsY0FBY0MsU0FBZCxDQUF3QjJDLFNBQXhCLEdBQW9DLFlBQVc7QUFDN0MsU0FBTzdDLGFBQVA7QUFDRCxDQUZEOztBQUlBOEMsT0FBT0MsT0FBUCxHQUFpQixJQUFJOUMsYUFBSixFQUFqQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XHJcbnZhciBIVE1MID0gcmVxdWlyZSgnaHRtbC1wYXJzZS1zdHJpbmdpZnkyJyk7XHJcbnZhciBzcWxGb3JtYXR0ZXIgPSByZXF1aXJlKFwic3FsLWZvcm1hdHRlclwiKTtcclxudmFyIGNvbnZlcnQgPSByZXF1aXJlKCcuL2xpYi9jb252ZXJ0Jyk7XHJcbnZhciBteUJhdGlzTWFwcGVyID0ge307XHJcblxyXG5mdW5jdGlvbiBNeWJhdGlzTWFwcGVyKCkge1xyXG5cclxufVxyXG5cclxuTXliYXRpc01hcHBlci5wcm90b3R5cGUuY3JlYXRlTWFwcGVyID0gZnVuY3Rpb24oeG1scykge1xyXG4gIGNvbnN0IHF1ZXJ5VHlwZXMgPSBbICdzcWwnLCAnc2VsZWN0JywgJ2luc2VydCcsICd1cGRhdGUnLCAnZGVsZXRlJyBdO1xyXG5cclxuICAvLyBQYXJzZSBlYWNoIFhNTCBmaWxlc1xyXG4gIGZvciAodmFyIGkgPSAwLCB4bWw7IHhtbCA9IHhtbHNbaV07IGkrKykge1xyXG4gICAgdHJ5e1xyXG4gICAgICB2YXIgcmF3VGV4dCA9IHRoaXMucmVwbGFjZUNkYXRhKGZzLnJlYWRGaWxlU3luYyh4bWwpLnRvU3RyaW5nKCkpOyAgICAgXHJcbiAgICAgIHZhciBtYXBwZXJzID0gSFRNTC5wYXJzZShyYXdUZXh0KTtcclxuICAgIH0gY2F0Y2ggKGVycil7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkVycm9yIG9jY3VyZWQgZHVyaW5nIG9wZW4gWE1MIGZpbGUgW1wiICsgeG1sICsgXCJdXCIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0cnl7XHJcbiAgICAgIGZvciAodmFyIGogPSAwLCBtYXBwZXI7IG1hcHBlciA9IG1hcHBlcnNbal07IGorKykge1xyXG4gICAgICAgIC8vIE1hcHBpbmcgPG1hcHBlcj4gdGFnIHJlY3Vyc2l2ZWx5XHJcbiAgICAgICAgdGhpcy5maW5kTWFwcGVyKG1hcHBlcik7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFcnJvciBvY2N1cmVkIGR1cmluZyBwYXJzZSBYTUwgZmlsZSBbXCIgKyB4bWwgKyBcIl1cIik7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuTXliYXRpc01hcHBlci5wcm90b3R5cGUuZmluZE1hcHBlciA9IGZ1bmN0aW9uKGNoaWxkcmVuKSB7XHJcbiAgdmFyIHF1ZXJ5VHlwZXMgPSBbICdzcWwnLCAnc2VsZWN0JywgJ2luc2VydCcsICd1cGRhdGUnLCAnZGVsZXRlJyBdO1xyXG5cclxuICBpZiAoY2hpbGRyZW4udHlwZSA9PSAndGFnJyAmJiBjaGlsZHJlbi5uYW1lID09ICdtYXBwZXInKSB7XHJcbiAgICAvLyBBZGQgTWFwcGVyXHJcbiAgICBteUJhdGlzTWFwcGVyW2NoaWxkcmVuLmF0dHJzLm5hbWVzcGFjZV0gPSB7fTtcclxuXHJcbiAgICBmb3IgKHZhciBqID0gMCwgc3FsOyBzcWwgPSBjaGlsZHJlbi5jaGlsZHJlbltqXTsgaisrKSB7XHJcbiAgICAgIGlmIChzcWxbJ3R5cGUnXSA9PSAndGFnJyAmJiBxdWVyeVR5cGVzLmluZGV4T2Yoc3FsWyduYW1lJ10pID4gLTEpIHtcclxuICAgICAgICBteUJhdGlzTWFwcGVyW2NoaWxkcmVuLmF0dHJzLm5hbWVzcGFjZV1bc3FsLmF0dHJzLmlkXSA9IHNxbC5jaGlsZHJlbjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBSZWN1cnNpdmUgdG8gbmV4dCBjaGlsZHJlblxyXG4gICAgaWYgKGNoaWxkcmVuWydjaGlsZHJlbiddICE9IG51bGwgJiYgY2hpbGRyZW5bJ2NoaWxkcmVuJ10ubGVuZ3RoID4gMCkge1xyXG4gICAgICBmb3IgKHZhciBqID0gMCwgbmV4dENoaWxkcmVuOyBuZXh0Q2hpbGRyZW4gPSBjaGlsZHJlbi5jaGlsZHJlbltqXTsgaisrKSB7XHJcbiAgICAgICAgdGhpcy5maW5kTWFwcGVyKG5leHRDaGlsZHJlbik7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbk15YmF0aXNNYXBwZXIucHJvdG90eXBlLnJlcGxhY2VDZGF0YSA9IGZ1bmN0aW9uKHJhd1RleHQpIHtcclxuICB2YXIgY2RhdGFSZWdleCA9IG5ldyBSZWdFeHAoJyg8IVxcXFxbQ0RBVEFcXFxcWykoW1xcXFxzXFxcXFNdKj8pKFxcXFxdXFxcXF0+KScsICdnJyk7XHJcbiAgdmFyIG1hdGNoZXMgPSByYXdUZXh0Lm1hdGNoKGNkYXRhUmVnZXgpO1xyXG4gIFxyXG4gIGlmIChtYXRjaGVzICE9IG51bGwgJiYgbWF0Y2hlcy5sZW5ndGggPiAwKSB7XHJcbiAgICBmb3IgKHZhciB6ID0gMDsgeiA8IG1hdGNoZXMubGVuZ3RoOyB6KyspIHtcclxuICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnKDwhXFxcXFtDREFUQVxcXFxbKShbXFxcXHNcXFxcU10qPykoXFxcXF1cXFxcXT4pJywgJ2cnKTtcclxuICAgICAgdmFyIG0gPSByZWdleC5leGVjKG1hdGNoZXNbel0pO1xyXG5cclxuICAgICAgdmFyIGNkYXRhVGV4dCA9IG1bMl07XHJcbiAgICAgIGNkYXRhVGV4dCA9IGNkYXRhVGV4dC5yZXBsYWNlKC9cXCYvZywnJmFtcDsnKTtcclxuICAgICAgY2RhdGFUZXh0ID0gY2RhdGFUZXh0LnJlcGxhY2UoL1xcPC9nLCcmbHQ7Jyk7XHJcbiAgICAgIGNkYXRhVGV4dCA9IGNkYXRhVGV4dC5yZXBsYWNlKC9cXD4vZywnJmd0OycpO1xyXG4gICAgICBjZGF0YVRleHQgPSBjZGF0YVRleHQucmVwbGFjZSgvXFxcIi9nLCcmcXVvdDsnKTtcclxuICAgICAgXHJcbiAgICAgIHJhd1RleHQgPSByYXdUZXh0LnJlcGxhY2UobVswXSwgY2RhdGFUZXh0KTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIHJhd1RleHQ7XHJcbn1cclxuXHJcbk15YmF0aXNNYXBwZXIucHJvdG90eXBlLmdldFN0YXRlbWVudCA9IGZ1bmN0aW9uKG5hbWVzcGFjZSwgc3FsLCBwYXJhbSwgZm9ybWF0KSB7XHJcbiAgdmFyIHN0YXRlbWVudCA9ICcnO1xyXG4gIFxyXG4gIC8vIFBhcmFtZXRlciBDaGVja1xyXG4gIGlmIChuYW1lc3BhY2UgPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKCdOYW1lc3BhY2Ugc2hvdWxkIG5vdCBiZSBudWxsLicpO1xyXG4gIGlmIChteUJhdGlzTWFwcGVyW25hbWVzcGFjZV0gPT0gdW5kZWZpbmVkKSB0aHJvdyBuZXcgRXJyb3IoJ05hbWVzcGFjZSBbJyArIG5hbWVzcGFjZSArICddIG5vdCBleGlzdHMuJyk7XHJcbiAgaWYgKHNxbCA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoJ1NRTCBJRCBzaG91bGQgbm90IGJlIG51bGwuJyk7XHJcbiAgaWYgKG15QmF0aXNNYXBwZXJbbmFtZXNwYWNlXVtzcWxdID09IHVuZGVmaW5lZCkgdGhyb3cgbmV3IEVycm9yKCdTUUwgSUQgWycgKyBzcWwgKyAnXSBub3QgZXhpc3RzJyk7XHJcbiAgXHJcbiAgdHJ5e1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGNoaWxkcmVuOyBjaGlsZHJlbiA9IG15QmF0aXNNYXBwZXJbbmFtZXNwYWNlXVtzcWxdW2ldOyBpKyspIHtcclxuICAgICAgLy8gQ29udmVydCBTUUwgc3RhdGVtZW50IHJlY3Vyc2l2ZWx5XHJcbiAgICAgIHN0YXRlbWVudCArPSBjb252ZXJ0LmNvbnZlcnRDaGlsZHJlbihjaGlsZHJlbiwgcGFyYW0sIG5hbWVzcGFjZSwgbXlCYXRpc01hcHBlcik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmIChmb3JtYXQgIT0gdW5kZWZpbmVkICYmIGZvcm1hdCAhPSBudWxsKXtcclxuICAgICAgc3RhdGVtZW50ID0gc3FsRm9ybWF0dGVyLmZvcm1hdChzdGF0ZW1lbnQsIGZvcm1hdCk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICB0aHJvdyBlcnJcclxuICB9XHJcbiAgc3RhdGVtZW50ID0gc3RhdGVtZW50LnJlcGxhY2UoLzogPS9nLCBcIjo9XCIpOyBcclxuICByZXR1cm4gc3RhdGVtZW50O1xyXG59O1xyXG5cclxuTXliYXRpc01hcHBlci5wcm90b3R5cGUuZ2V0TWFwcGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIG15QmF0aXNNYXBwZXI7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBNeWJhdGlzTWFwcGVyKCk7XHJcbiJdfQ==
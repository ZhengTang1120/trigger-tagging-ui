function table(){
    var colors = d3.scaleLinear()
    .domain([0, 1])
    .range(['black','red']);

    d3.select("#main_div").selectAll(".table_div").remove();
    var c1 = d3.select("#main_div").append("div").attr("class", "table_div");
    var f = document.getElementById("mySelect").value;
    if (f == 'predicted')
        var datapoint = c1.selectAll("table").data(data.filter(function(d){ return d.predicted_tags.reduce((a, b) => Math.round(a) + Math.round(b), 0) != 0; }))
    else if (f == 'gold'){
        var datapoint = c1.selectAll("table").data(data.filter(function(d){ return d.gold_tags.reduce((a, b) => a + b, 0) != 0; }))
    }
    else if (f == 'sample'){
        var d = data.filter(function(d){ return (d.gold_tags.reduce((a, b) => a + b, 0) == 0 && d.predicted_tags.reduce((a, b) => Math.round(a) + Math.round(b), 0) != 0) && d.predicted_label != d.gold_label; })
        console.log(d.length)
        var sample = _.sampleSize(d, 50);
        var datapoint = c1.selectAll("table").data(sample)
    }
    else
        var datapoint = c1.selectAll("table").data(data.filter(function(d){ return d.gold_label == f && d.gold_label == d.predicted_label; }))//&& (d.predicted_tags.reduce((a, b) => Math.round(a) + Math.round(b), 0) != 0 || d.gold_tags.reduce((a, b) => a + b, 0) != 0); }))
    // var datapoint = c1.selectAll("table").data(data)
    var row = datapoint.enter().append('table').append("tr");
    row.append('td').append('input')
    row.append('td').text(function(d){ return d.gold_label; }).attr('style','color:darkorange');
    row.append('td').text(function(d){ return d.predicted_label; }).attr('style','color:blue');
    var words = row.append("tr").selectAll("td").data(function (d) 
                { return d.raw_words.map(function(e, i) {
                      return [e, d.predicted_tags[i], d.subj[i], d.obj[i]];
                    });;
                }).enter().filter(function(e){ return e[0] != "[CLS]"; }).append("td");
    // words.attr('style', function(e) {
    //     if (e[2]==1)
    //         return 'background-color:DarkSeaGreen;'
    // });
    text = words.text(function (e) { return e[0].replaceAll('-','-'); });
    words.attr('style', function(e) {
        // return colors(e[1][0]);
        // else
        //     return 'color:'+colors[e[1]]
        if (e[2] == 1)
            return 'background-color:CornflowerBlue;'
        if (e[3] == 1)
            return 'background-color:Chocolate;'
        // if (e[1]==1.0 && e[2]==1)
        //     return 'color:red; background-color:DarkSeaGreen;'
        // else 
        if (e[1]==1.0)
            return 'color:red;'
        //     if (e[2]==1)
        //         return 'background-color:DarkSeaGreen;'
    });
    datapoint.exit().remove();
}


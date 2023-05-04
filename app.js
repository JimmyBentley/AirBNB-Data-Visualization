function finalProject(){
    var filePath="AB_NYC_2019.csv";
    viewFile(filePath);
    figure1(filePath);
    figure2(filePath);
    figure3(filePath);
    figure4(filePath);
    figure5(filePath);
}

var viewFile=function(filePath){
    d3.csv(filePath, rowConverter).then(function(data){
        //console.log(data)
    });
}

var rowConverter = function(d){
    return {
            availability_365: +d.availability_365,
            calculated_host_listings_count: +d.calculated_host_listings_count,
            host_id: d.host_id,
            last_review: d.last_review,
            latitude: +d.latitude,
            longitude: +d.longitude,
            minimum_nights: +d.minimum_nights,
            name: d.name,
            neighbourhood: d.neighbourhood,
            neighbourhood_group: d.neighbourhood_group,
            number_of_reviews: +d.number_of_reviews,
            price: +d.price,
            reviews_per_month: +d.reviews_per_month,
            room_type: d.room_type,
    }
}

var figure1=function(filePath){
    d3.csv(filePath, rowConverter).then(function(data) {
        d3.csv(filePath, rowConverter).then(data=>{
            var width = 1200;
            var height = 600;
            var margin = {
                top: 60, bottom: 60, left: 50, right: 50
            }
            //reading data
    
            private = []
            home = []
            shared = []
            
            for (let i in data) {
                var current = data[i]
                if (current.room_type == "Private room") {
                    private.push({
                        price: current.price,
                        number_of_reviews: current.number_of_reviews
                    })
                } else if (current.room_type == "Entire home/apt") {
                    home.push({
                        price: current.price,
                        number_of_reviews: current.number_of_reviews
                    })
                } else if (current.room_type == "Shared room") {
                    shared.push({
                        price: current.price,
                        number_of_reviews: current.number_of_reviews
                    })
                }
            }
    
            // Creating scatter plot on private rooms
            const svg = d3.select("#fig1_plot")
                .append("svg")
                .attr("width", width - margin.right - margin.left)
                .attr("height", height - margin.top - margin.bottom)
                .attr("viewBox", [0, 0, width, height]);
    
            var xScale = d3.scaleLinear()
                .domain([0, d3.max(private, function (d) {
                    return d.number_of_reviews
                })])
                .range([margin.left, width - margin.right]);

            var yScale = d3.scaleLinear()
                .domain([0, d3.max(private, function (d) {
                    return d.price
                })])
                .range([height - margin.bottom, margin.top]);

            var x_axis = d3.axisBottom(xScale)
            var y_axis = d3.axisLeft(yScale);
    
            svg.append("g")
                .attr('transform', `translate(${margin.left},0)`)
                .attr("class","y_axis")
                .call(y_axis)
                .append("text")
                .attr("text-anchor", "end")
    
            svg.append('g')
                .attr('transform', `translate(0,${height - margin.bottom})`)
                .attr("class","x_axis")
                .call(x_axis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("transform", "rotate(-30)");
                    
            svg.append('g')
                .selectAll('circle')
                .data(private)
                .enter()
                .append('circle')
                .attr('fill', '#00A699')
                .attr('stroke', "#484848")
                .attr('cx', d => xScale(d.number_of_reviews))
                .attr('cy', d => yScale(d.price))
                .attr('r', 5)
    
            // x-label
            svg.append("text")
                .attr("x", width/2.25)
                .attr("y", height-margin.top/3)
                .text("Number of Reviews")
                .attr("transform", "translate(7, 10)");
    
            // y-label
            svg.append("text")
                .attr("x", -margin.left/1.3)
                .attr("y", (height)/2)
                .text("Price")
    
            // title
            svg.append("text")
                .attr("x", width/3.5)
                .attr("y", margin.top)
                .text("Relationship between Price and Number of Reviews")
                .attr("transform", "translate(0, 0)")
                .attr("font-size", "30px");
                
    
            var radio = d3.select('#radio_fig1')
                .attr('city', 'restaurant').on("change", function (d) {
                    current_restaurant = d.target.value; //getting the value of selected radio button
    
                    if (current_restaurant == "Private Room") {
                        c_data = private
                    } else if (current_restaurant == "Entire Home/Apartment") {
                        c_data = home
                    } else if (current_restaurant == "Shared Room") {
                        c_data = shared
                    }
        
                    var x = d3.scaleLinear()
                        .domain([0, d3.max(c_data, function (d) {
                            return d.number_of_reviews
                        })])
                        .range([margin.left, width - margin.right]);
                
                    var y = d3.scaleLinear()
                        .domain([0, d3.max(c_data, function (d) {
                            return d.price
                        })])
                        .range([height - margin.bottom, margin.top]);
    
                    var x_axis = d3.axisBottom(x);
                    var y_axis = d3.axisLeft(y);
    
                    svg.append('g')
                        .attr('transform', `translate(0,${height - margin.bottom})`)
                        .attr("class","x_axis")
                        .call(x_axis)
                        .selectAll("text")
                        .style("text-anchor", "end")
                        .attr("dx", "-.8em")
                        .attr("dy", ".15em")
                        .attr("transform", "rotate(-30)");
    
                    svg.selectAll("g.x_axis")
                        .transition()
                        .call(x_axis)
                        .selectAll("text")
                        .style("text-anchor", "end")
                        .attr("dx", "-.8em")
                        .attr("dy", ".15em")
                        .attr("transform", "rotate(-30)");
    
                    d3.selectAll("g.y_axis")
                        .transition()
                        .call(y_axis);
    
                    var points = svg.selectAll("circle")
                    points.data(c_data)
                        .join(enter => enter.append('circle')) 
                        .transition()
                        .attr('fill', '#00A699')
                        .attr('stroke', "#484848")
                        .attr('cx', (d, i) => x(d.number_of_reviews))
                        .attr('cy', (d, i) => y(d.price))
                        .attr('r', 5)
                })
    
        })
})
}

var figure2=function(filePath){
    d3.csv(filePath, rowConverter).then(function(data){
         
         var output = d3.rollup(data, v=>d3.mean(v, d=>d.price), d=>d.neighbourhood);
         output = new Map(Array.from(output).sort((a,b) => b[1] - a[1]).slice(0,20))
         const neighbourhoods = Array.from(output.keys()).sort()

         var svgheight = 800;
		 var svgwidth = 1200;
		 var padding = 160;

		 var svg = d3.select("#fig2_plot").append("svg")
				 .attr("height", svgheight)
			 	 .attr("width", svgwidth);

	 	 var xScale = d3.scaleBand()
 	 					 .domain(neighbourhoods) 
 	 					 .range([padding, svgwidth-padding])
						 .paddingInner(0.1);

		 var yScale = d3.scaleLinear()
						.domain([d3.max(output.values()),0])
						.range([padding, svgheight - padding]);

		 var groups = svg.selectAll(".gbars")
			 .data(output).enter().append("g")
			 .attr("class","gbars");

		 var rects = groups.selectAll("rect")
			 .data(output)
			 .enter()
			 .append("rect")
			 .attr("x", function(d) { return xScale(d[0])})
			 .attr("y", function(d) { return yScale(d[1])})
			 .attr("width", function(d) { return xScale.bandwidth()})
			 .attr("height", function(d) { return svgheight - yScale(d[1]) - padding})
             .attr("fill", "#FF5A60")
    

         const xAxis = d3.axisBottom(xScale);
         const yAxis = d3.axisLeft(yScale);


         // x axis
        svg.append('g')
        .attr('transform', `translate(0,${svgheight - padding})`)
        .attr("class","xAxis")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-30)");

         //y axis
         svg.append("g")
            .attr('transform', `translate(${padding},0)`)
            .attr("class","yAxis")
            .call(yAxis)
            .append("text")
            .attr("text-anchor", "end")

        // x-label
        svg.append("text")
            .attr("x", (svgwidth-padding)/2)
            .attr("y", svgheight-padding/1.8)
            .text("Neighborhood")
            .attr("transform", "translate(7, 10)");

        // y-label
        svg.append("text")
            .attr("x", 0)
            .attr("y", svgheight/2 - padding/6)
            .text("Average Listing Price")

        // title
        svg.append("text")
            .attr("x", svgwidth/2.7)
            .attr("y", padding)
            .text("Most Expensive Neighborhoods")
            .attr("transform", "translate(0, 0)")
            .attr("font-size", "30px");
     })
}


figure3=function(filePath){
    d3.csv(filePath, rowConverter).then(function(data){

        
        var vals =  Array.from(data).map(val => val.price)
        var priceBins = []
        const iterBy = .10
        
        for (let i = iterBy; i < 1; i+=iterBy) {
            priceBins.push(Math.round(d3.quantile(vals, i)))
        }

        for (let i in data) {
            current = data[i]
            if (current.price < priceBins[0]) {
                data[i]['priceBin'] = priceBins[0]
            } else if (current.price < priceBins[1]) {
                data[i]['priceBin'] = priceBins[1]
            } else if (current.price < priceBins[2]) {
                data[i]['priceBin'] = priceBins[2]
            } else if (current.price < priceBins[3]) {
                data[i]['priceBin'] = priceBins[3]
            } else if (current.price < priceBins[4]) {
                data[i]['priceBin'] = priceBins[4]
            } else if (current.price < priceBins[5]) {
                data[i]['priceBin'] = priceBins[5]
            } else if (current.price < priceBins[6]) {
                data[i]['priceBin'] = priceBins[6]
            } else if (current.price < priceBins[7]) {
                data[i]['priceBin'] = priceBins[7]
            } else if (current.price < priceBins[8]) {
                data[i]['priceBin'] = priceBins[8]
            } else {
                data[i]['priceBin'] = priceBins[9]
            }
        }

        output = d3.rollup(data, v=>d3.sum(v, d=>d.number_of_reviews), 
            d=>d.priceBin,
            d=>d.neighbourhood
        )

        output = Array.from(output)

        var topNeighbourhoods  = d3.rollup(data, v=>d3.sum(v, d=>d.number_of_reviews), d=>d.neighbourhood);
        topNeighbourhoods = new Map(Array.from(topNeighbourhoods).sort((a,b) => b[1] - a[1]).slice(0,20))

        var neighbourhoods = Array.from(topNeighbourhoods.keys()).sort().reverse()
        var neighbourhoodsSet = new Set(neighbourhoods)

        data_clean = []
        for (let i in output) {
            result = Array.from(output[i][1])
            for (let j in result) {
                if (neighbourhoodsSet.has(result[j][0])) {
                    data_clean.push({
                        priceBin: output[i][0],
                        neighbourhood: result[j][0],
                        number_of_reviews: result[j][1]
                    })
                }
            }
        }
        //var neighbourhoods = Array.from(new Set(data.map(d => d.neighbourhood).sort().reverse()))

        var height = 900;
        var width = 1100;
        var margin = {
            top: 20, bottom: 70, left: 150, right: 0
        }

        const svg = d3.select("#fig3_plot")
                .append("svg")
                .attr("width", width - margin.right - margin.left)
                .attr("height", height - margin.top - margin.bottom)
                .attr("viewBox", [0, 0, width, height])
        
        var xScale = d3.scaleBand()
            .domain(priceBins)
            .range([margin.left, width - margin.right])
            .padding(0.1);
        
        var yScale = d3.scaleBand()
            .domain(neighbourhoods)
            .range([height - margin.bottom, margin.top])
            .padding(0.1);

        var x_axis = d3.axisBottom(xScale)
        var y_axis = d3.axisLeft(yScale);

        var Tooltip = d3.select("#fig3_plot").append("div").style("opacity", 0).attr("class", "tooltip")
        
        var color = d3.scaleLinear()
        .range(["#F8F5F9", "#FC642D"])
        .domain([d3.min(data_clean, function(d) { return d.number_of_reviews}), 
            d3.max(data_clean, function(d) { return d.number_of_reviews})])


        svg.append("g")
            .attr('transform', `translate(${margin.left},0)`)
            .call(y_axis)
            .append("text")
            .attr("dx", "-.1em")
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(x_axis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr('transform', `translate(15,10)`)

        // x-label
        svg.append("text")
            .attr("x", width/2)
            .attr("y", height-margin.top)
            .text("Price")
            .attr("transform", "translate(7, 10)");

        // y-label
        svg.append("text")
            .attr("x", 0)
            .attr("y", height/2 - 11)
            .text("Neighborhood")

        // title
        svg.append("text")
            .attr("x", width/3.25)
            .attr("y", margin.top/2)
            .text("Price Range Distribution within Neighborhoods")
            .attr("transform", "translate(0, 0)")
            .attr("font-size", "30px");
        
        svg.selectAll()
            .data(data_clean)
            .enter()
            .append("rect")
            .attr("x", function(d) { return xScale(d.priceBin) })
            .attr("y", function(d) { return yScale(d.neighbourhood) })
            .attr("width", xScale.bandwidth())
            .attr("height", yScale.bandwidth())
            .style("fill", function(d) { return color(d.number_of_reviews)} )
            .attr("rx", "3px")
            .attr("ry", "3px")
            .on("mouseover", function (event, d) {
                d3.select(this).attr('stroke', 'black').attr('stroke-width', '1');
                Tooltip.transition().duration(100).style("opacity", 0.9);
                Tooltip.text(d.number_of_reviews)
                        .style("left", (event.pageX + 15) + "px")
                        .style("top", (event.pageY + 15) + "px");
            })
            .on("mousemove", function (event, d) {
                Tooltip.style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY + 15) + "px");
            })
            .on("mouseout", function (event, d) {
                Tooltip.transition().duration(100).style("opacity", 0);
                d3.select(this).attr('stroke', 'none');
            });
    })
}

figure4=function(filePath){
    d3.csv(filePath, rowConverter).then(function(data){

        const height = 700
        const width = 800
        var meanLatLong = d3.rollup(data, function(v) { return {
                latitude: d3.mean(v, d => d.latitude),
                longitude: d3.mean(v, d => d.longitude)
            } 
        }, d => d.neighbourhood)

        var cleaned_data = []
        for (let i in data) {
            var neighbourhood = data[i].neighbourhood
            if (meanLatLong.get(neighbourhood) != null) {
                cleaned_data.push(
                    {
                        id: i,
                        neighbourhood: neighbourhood,
                        latitude: meanLatLong.get(neighbourhood).latitude,
                        longitude: meanLatLong.get(neighbourhood).longitude
                    }
                )
            }
        }

        var output = d3.rollup(cleaned_data, function(v) { 
            return {
                value: d3.count(v, d=>d.id),
                latitude: d3.mean(v, d=>d.latitude),
                longitude: d3.mean(v, d=>d.longitude)
            }
        }, d=>d.neighbourhood)

        var svg = d3.select("#fig4_plot")
            .append("svg").attr("width", width)
            .attr("height", height);


        var background = svg.append("g")
        const projection  = d3.geoAlbersUsa().scale(62000).translate([-17825,4550]) //chain translate and scale
        const pathgeo = d3.geoPath().projection(projection)
        const map = d3.json('us-states.json')
        map.then(function(map){
            background.selectAll('path')
                .data(map.features)
                .enter()
                .append('path')
                .attr('d',pathgeo)
                .attr('fill', function(d) {
                    if (d.properties.name == 'NY') {
                        return "#00A699";
                    }
                    return "none";
                    
                })
                .attr('stroke', function(d) {
                    if (d.properties.name == 'NY') {
                        return "black";
                    }
                    return "none";
                    
                })
        })

        // title
        svg.append("text")
            .attr("x", width/2.3)
            .attr("y", height/1.25)
            .text("Listings per Neighborhood")
            .attr("transform", "translate(0, 50)")
            .attr("font-size", "30px");

        var Tooltip = d3.select("#fig4_plot").append("div").style("opacity", 0).attr("class", "tooltip")
        // data points
        var dataPoints = svg.append("g")
        dataPoints.selectAll("circle")
            .data(output)
            .enter()
            .append("circle")            
            .attr("cx", function(d) {
                return projection([d[1].longitude, d[1].latitude])[0];
              })
              .attr("cy", function(d) {
                return projection([d[1].longitude, d[1].latitude])[1];
              })
            .attr("r", function(d){ return Math.log2(d[1].value)})
            .style("fill", "#FC642D")
            .attr("stroke", "#484848")
            .attr("opacity", .75)
            .on("mouseover", function (event, d) {
                d3.select(this).attr('stroke', 'black').attr('stroke-width', '1');
                Tooltip.transition().duration(100).style("opacity", 0.9);
                Tooltip.text(d[0] + ": " + d[1].value + " listings")
                        .style("left", (event.pageX + 15) + "px")
                        .style("top", (event.pageY + 15) + "px");
            })
            .on("mousemove", function (event, d) {
                Tooltip.style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY + 15) + "px");
            })
            .on("mouseout", function (event, d) {
                Tooltip.transition().duration(100).style("opacity", 0);
                d3.select(this).attr('stroke', 'none');
            });
    });
}

figure5=function(filePath){
    d3.csv(filePath, rowConverter).then(function(data) {

        var margin = {top: 100, right: 30, bottom: 60, left: 40},
        width = 680 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

        var svg = d3.select("#fig5_plot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var sumstat = d3.rollup(data, function(d) {
                q1 = d3.quantile(d.map(function(g) { return g.price;}).sort(d3.ascending),.25)
                median = d3.quantile(d.map(function(g) { return g.price;}).sort(d3.ascending),.5)
                q3 = d3.quantile(d.map(function(g) { return g.price;}).sort(d3.ascending),.75)
                interQuantileRange = q3 - q1
                min = q1 - 1.5 * interQuantileRange
                max = q3 + 1.5 * interQuantileRange
                return {
                    q1: q1,
                    median: median, 
                    q3: q3, 
                    interQuantileRange: interQuantileRange, 
                    min: min, 
                    max: max
                }
            }, d=>d.room_type)

        var x = d3.scaleBand()
            .range([0, width])
            .domain(["Private room", "Entire home/apt", "Shared room"])
            .paddingInner(1)
            .paddingOuter(.5)
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))

        var y = d3.scaleLinear()
            .domain([d3.min(sumstat, function(d) { return d[1].min}),
                d3.max(sumstat, function(d) { return d[1].max})])
            .range([height, 0])
        svg.append("g").call(d3.axisLeft(y))

        svg.selectAll("vertLines")
            .data(Array.from(sumstat))
            .enter()
            .append("line")
            .attr("x1", function(d){return(x(d[0]))})
            .attr("x2", function(d){return(x(d[0]))})
            .attr("y1", function(d){return(y(d[1].min))})
            .attr("y2", function(d){return(y(d[1].max))})
            .attr("stroke", "black")
            .style("width", 40)

        var boxWidth = 100
        svg.selectAll("boxes")
        .data(Array.from(sumstat))
        .enter()
        .append("rect")
            .attr("x", function(d){return(x(d[0])-boxWidth/2)})
            .attr("y", function(d){return(y(d[1].q3))})
            .attr("height", function(d){return(y(d[1].q1)-y(d[1].q3))})
            .attr("width", boxWidth )
            .attr("stroke", "black")
            .style("fill", "#FF5A5F")

        svg.selectAll("medianLines")
            .data(Array.from(sumstat))
            .enter()
            .append("line")
            .attr("x1", function(d){return(x(d[0])-boxWidth/2) })
            .attr("x2", function(d){return(x(d[0])+boxWidth/2) })
            .attr("y1", function(d){return(y(d[1].median))})
            .attr("y2", function(d){return(y(d[1].median))})
            .attr("stroke", "black")
            .style("width", 80)
        
        // title
        svg.append("text")
            .attr("x", width/3 - margin.left)
            .attr("y", -margin.top)
            .text("Prices by Room Type")
            .attr("transform", "translate(0, 50)")
            .attr("font-size", "30px");
            
        // x-label
        svg.append("text")
            .attr("x", (width - margin.left)/2 - margin.right / 1.3)
            .attr("y", height + margin.bottom/2)
            .text("Room Type")
            .attr("transform", "translate(7, 10)");
        // y-label
        svg.append("text")
            .attr("x", -margin.left)
            .attr("y", height/2)
            .text("Price")
        
        var radio = d3.select('#radio_fig5')
            .attr('name', 'room_type').on("change", function (d) {
                current_room = d.target.value; 
                var temp = Array.from(sumstat)
                if (current_room == "Private Room") {
                    c_data = temp[0]
                } else if (current_room == "Entire Home/Apartment") {
                    c_data = temp[1]
                } else if (current_room == "Shared Room") {
                    c_data = temp[2]
                }

            svg.selectAll("*").remove();
    
            var x = d3.scaleBand()
                .range([0, width])
                .domain([current_room])
                .paddingInner(1)
                .paddingOuter(.5)
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))

            var y = d3.scaleLinear()
                .domain([c_data[1].min,
                    c_data[1].max])
                .range([height, 0])
            svg.append("g").call(d3.axisLeft(y))

            svg.selectAll("vertLines")
                .data(Array.from(c_data))
                .enter()
                .append("line")
                .attr("x1", function(d){return(x(current_room))})
                .attr("x2", function(d){return(x(current_room))})
                .attr("y1", function(d){return(y(d.min))})
                .attr("y2", function(d){return(y(d.max))})
                .attr("stroke", "black")
                .style("width", 40)

            var boxWidth = 150
            svg.selectAll("boxes")
            .data(Array.from(c_data))
            .enter()
            .append("rect")
                .attr("x", function(d){return(x(current_room)-boxWidth/2)})
                .attr("y", function(d){return(y(d.q3))})
                .attr("height", function(d){
                    return(y(d.q1)-y(d.q3))})
                .attr("width", boxWidth)
                .attr("stroke", "black")
                .style("fill", "#FF5A5F")

            svg.selectAll("medianLines")
                .data(Array.from(c_data))
                .enter()
                .append("line")
                .attr("x1", function(d){return(x(current_room)-boxWidth/2) })
                .attr("x2", function(d){return(x(current_room)+boxWidth/2) })
                .attr("y1", function(d){return(y(d.median))})
                .attr("y2", function(d){return(y(d.median))})
                .attr("stroke", "black")
                .style("width", 80)
            })

            // title
            svg.append("text")
                .attr("x", width/3 - margin.left)
                .attr("y", -margin.top)
                .text("Prices by Room Type")
                .attr("transform", "translate(0, 50)")
                .attr("font-size", "30px");
                
            // x-label
            svg.append("text")
                .attr("x", (width - margin.left)/2 - margin.right / 1.3)
                .attr("y", height + margin.bottom/2)
                .text("Room Type")
                .attr("transform", "translate(7, 10)");

            // y-label
            svg.append("text")
                .attr("x", -margin.left)
                .attr("y", height/2)
                .text("Price")
    })
}
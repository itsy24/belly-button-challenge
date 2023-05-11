function buildMetadata(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      let metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      sample_obj = metadata.filter(sampleNumber => sampleNumber.id == sample)[0];
      
      // Use d3 to select the panel with id of `#sample-metadata`
      let panel = d3.select('#sample-metadata')
  
      // Use `.html("") to clear any existing metadata -- so it doesn't keep adding on 
      panel.html('')
  
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      for (i in sample_obj) {
        panel.append('h6').text(`${i}: ${sample_obj[i]}`);
      }
      // BONUS: Build the Gauge Chart
      let gaugey = {
        type: 'indicator',
        mode: 'gauge+number',
        value: sample_obj.wfreq,
        gauge: {
          axis:{range: [0, 9] },
          steps: [
            { range: [0, 1], color: '#BED78C'},
            { range: [1, 2], color: '#B0CF8B'},
            { range: [2, 3], color: '#9FC488'},
            { range: [3, 4], color: '#8FBC6E'},
            { range: [4, 5], color: '#9FD12B'},
            { range: [5, 6], color: '#9ECD2F'},
            { range: [6, 7], color: '#A1CB2D'},
            { range: [7, 8], color: '#8DC42E'},
            { range: [8, 9], color: '#82A24C'}
            
          ],
        threshold: {
          line: {color: 'red', width: 4},
          thickness: 0.75,
          value: sample_obj.wfreq
        }
        }
      };
      
      let gLayout = {
        width: 600,
        height: 400,
        title: 'Belly Button Washing Frequency per Week'

      };
    Plotly.newPlot('gauge', [gaugey], gLayout)
    });
  }
  
  function buildCharts(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
  
      // Build a Bubble Chart
      let bubbleData = {
      //key value pairs..samples filter to one of the ids which have the 0 index which we can then grab the .otu ids (cause again dictionary)
        x: data.samples.filter(sampleNumber => sampleNumber.id == sample)[0].otu_ids,
      //grabs the otu_label
        y: data.samples.filter(sampleNumber => sampleNumber.id == sample)[0].sample_values,
        text: data.samples.filter(sampleNumber => sampleNumber.id == sample)[0].otu_labels,
        mode: 'markers',
        marker: {
          size: data.samples.filter(sampleNumber => sampleNumber.id == sample)[0].sample_values
        }
      };
      
      let bubbleLayout = {
        height: 500,
        width: 1000,
        xaxis: {title: {
          text: 'OTU ID'

        }}
      };
  
      Plotly.newPlot("bubble", [bubbleData], bubbleLayout,{responsive:true});
      let barData = {
        //key value pairs..samples filter to one of the ids which have the 0 index which we can then grab the .otu ids (cause again dictionary)
          x: data.samples.filter(sampleNumber => sampleNumber.id == sample)[0].sample_values.slice(0,10).reverse(),
          y: data.samples.filter(sampleNumber => sampleNumber.id == sample)[0].otu_ids.slice(0,10).map(otu => `OTU ${otu}`).reverse(),
          text: data.samples.filter(sampleNumber => sampleNumber.id == sample)[0].otu_labels.slice(0,10).reverse(),
          type: 'bar',
          orientation: 'h'
        };
        
        Plotly.newPlot("bar", [barData],{responsive:true});

    });
  };

  function init() {
    // Grab a reference to the dropdown select element
    let dropdown = d3.select('#selDataset');
    // Use the list of sample names to populate the select options
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      let sampleNames = data.names;
      
      for (let i = 0; i < sampleNames.length; i++) {
        //append the option tag's value (hence property) to whatever samplename we're currently on .text which number it is
        dropdown.append('option').property('value', sampleNames[i]).text(sampleNames[i]);
      };
    buildMetadata(sampleNames[0]);
    buildCharts(sampleNames[0]);
    })};

  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
  };
  
  // Initialize the dashboard
  init();
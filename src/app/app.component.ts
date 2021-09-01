import { Component, NgZone } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_continentsLow from "@amcharts/amcharts4-geodata/continentsLow";
import * as am4plugins_bullets from "@amcharts/amcharts4/plugins/bullets"; 
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as d3geo from "d3-geo";


am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  private chart!: am4maps.MapChart;

  constructor(private zone: NgZone) { };

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("chartdiv", am4maps.MapChart);
      chart.geodata = am4geodata_continentsLow;
      chart.projection = new am4maps.projections.Miller();
      let color1 = chart.colors.getIndex(0);

      chart.homeGeoPoint = {
        latitude: 50,
        longitude: 0
      }
      chart.homeZoomLevel = 0.75;
      chart.minZoomLevel = 0.75;
      
      // Create map polygon series
      let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
      polygonSeries.exclude = ["antarctica"];
      polygonSeries.useGeodata = true;
      
      // Configure series
      let polygonTemplate = polygonSeries.mapPolygons.template;
      polygonTemplate.fill = am4core.color("#00FF00");
      
      // Add shadow
      let shadow = polygonSeries.filters.push(new am4core.DropShadowFilter());
      shadow.color = am4core.color("#FF0000");
      shadow.blur = 0;
      
      // Pins
      let imageSeries = chart.series.push(new am4maps.MapImageSeries());
      let imageTemplate = imageSeries.mapImages.template;
      imageTemplate.propertyFields.longitude = "longitude";
      imageTemplate.propertyFields.latitude = "latitude";
      imageTemplate.nonScaling = true;
      
      // Creating a pin bullet
      let pin = imageTemplate.createChild(am4plugins_bullets.PinBullet);
      
      // Configuring pin appearance
      pin.background.fill = am4core.color("#FF0000");
      pin.background.pointerBaseWidth = 1;
      pin.background.pointerLength = 250;
      pin.background.propertyFields.pointerLength = "length";
      pin.circle.fill = pin.background.fill;
      pin.label = new am4core.Label();
      pin.label.text = "{value}%";
      pin.label.fill = am4core.color("#FFFAFA");
      
      let label = pin.createChild(am4core.Label);
      label.text = "{title}";
      label.fontWeight = "bold";
      label.propertyFields.dy = "length";
      label.verticalCenter = "middle";
      label.fill = am4core.color("#8B0000");
      // label.adapter.add("dy", function(dy) {
      //   return (20 + dy) * -1;
      // });
      
      // Creating a "heat rule" to modify "radius" of the bullet based
      // on value in data
      imageSeries.heatRules.push({
        "target": pin.background,
        "property": "radius",
        "min": 20,
        "max": 30,
        "dataField": "value"
      });
      
      imageSeries.heatRules.push({
        "target": label,
        "property": "dx",
        "min": 30,
        "max": 40,
        "dataField": "value"
      });
      
      imageSeries.heatRules.push({
        "target": label,
        "property": "paddingBottom",
        "min": 0,
        "max": 10,
        "dataField": "value"
      });
      
      // Pin data
      imageSeries.data = [{
        "latitude": 40,
        "longitude": -101,
        "value": 12,
        "title": "United\nStates",
        "length": 150
      }, {
        "latitude": 0,
        "longitude": 25,
        "value": 5,
        "title": "Africa",
        "length": 40
      }, {
        "latitude": 43,
        "longitude": 5,
        "value": 15,
        "title": "European\nUnion",
        "length": 100
      }, {
        "latitude": 40,
        "longitude": 95,
        "value": 8,
        "title": "Asia",
        "length": 80
      }];
})

}

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    })
  }



}
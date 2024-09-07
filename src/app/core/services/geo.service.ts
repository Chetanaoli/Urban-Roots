import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import ZoomToExtent from 'ol/control/ZoomToExtent';
import FullScreen from 'ol/control/FullScreen';
import Attribution from 'ol/control/Attribution';
import OsmSource from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import DragAndDrop from 'ol/interaction/DragAndDrop';
import GeoJSON from 'ol/format/GeoJSON';
import { fromLonLat, toLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import { defaults as defaultInteractions, PinchZoom } from 'ol/interaction';
import { Injectable, OnInit } from '@angular/core';
import { Collection, Feature } from 'ol';
import { Circle, Geometry, Point } from 'ol/geom';
import { Vector } from './vector';
import { Fill, Icon, Stroke, Style } from 'ol/style';
import { FeatureLike } from 'ol/Feature';
import OSM from 'ol/source/OSM';
import { SupabaseService } from './supabase.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class GeoService implements OnInit {

  tileSources = [
    { name: 'None', source: null },
    { name: 'OSM', source: new OsmSource() },
  ];

  selectedTileSource = this.tileSources[1];
  vectorSources: Vector[] = [];

  private  map: Map;
  private  tileLayer: TileLayer<OsmSource>;
  private  vectorLayer: VectorLayer<any>;
  private  extent = [813079.7791264898, 5929220.284081122, 848966.9639063801, 5936863.986909639];
  private  vectorSource: VectorSource<FeatureLike>; // Change to FeatureLike
  gardens: any;

  constructor(private supaService: SupabaseService) {

    const darkTileLayer = new TileLayer({
        source: new OSM({
          url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        }),
      });


    this.vectorSource = new VectorSource<FeatureLike>(); // Update here


    

    this.tileLayer = new TileLayer();
    this.vectorLayer = new VectorLayer({
        source: this.vectorSource // Set the vector source here
    });
    this.map = new Map({
      interactions: defaultInteractions().extend([
        new PinchZoom()
      ]),
      layers: [
        darkTileLayer,
        // this.tileLayer,
        this.vectorLayer
      ],
      view: new View({
        constrainResolution: true
      }),
      controls: defaultControls().extend([
        // new Attribution(),
        // new ZoomToExtent({ extent: this.extent }),
        new FullScreen()
      ])
    });

    this.map.on('singleclick', (event) => {
        this.handleMapClick(event);
    });

    const dragAndDropInteraction = new DragAndDrop({ formatConstructors: [GeoJSON] });

    dragAndDropInteraction.on('addfeatures', (event) => {

      const features = (event.features ?? []) as Feature<Geometry>[] | Collection<Feature<Geometry>> | undefined;
      const vectorSource = new VectorSource({ features });
      const vector: Vector = { name: event.file.name, source: vectorSource };

      this.vectorSources.push(vector);
      this.setVectorSource(vector);
    });

    this.map.addInteraction(dragAndDropInteraction);
  }


  initLatMap(onLocationSelected: (lat: number, lng: number) => void): void {
    const darkTileLayer = new TileLayer({
      source: new OSM({
        url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      }),
    });


  this.vectorSource = new VectorSource<FeatureLike>(); // Update here


  

  this.tileLayer = new TileLayer();
  this.vectorLayer = new VectorLayer({
      source: this.vectorSource // Set the vector source here
  });
  this.map = new Map({
    interactions: defaultInteractions().extend([
      new PinchZoom()
    ]),
    layers: [
      darkTileLayer,
      // this.tileLayer,
      this.vectorLayer
    ],
    view: new View({
      constrainResolution: true
    }),
    controls: defaultControls().extend([
      // new Attribution(),
      // new ZoomToExtent({ extent: this.extent }),
      new FullScreen()
    ])
  });


  this.updateView();
  this.setTileSource();
  this.updateSize();

  this.map.on('singleclick', (event) => {
    this.handleMapClick(event);

    const coords = event.coordinate; // Get coordinates of the click event
    const lonLat = toLonLat(coords); // Convert to lon/lat

    // Call the callback with lat and lng
    onLocationSelected(lonLat[1], lonLat[0]); // lonLat is [longitude, latitude]
    });
  }

  ngOnInit(): void {
    if (!this.map) {
      setTimeout(() => { // Add a slight delay
        this.initMap();
      }, 0);
    }
  }

  initMap() {
    const darkTileLayer = new TileLayer({
      source: new OSM({
        url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      }),
    });


  this.vectorSource = new VectorSource<FeatureLike>(); // Update here


  

  this.tileLayer = new TileLayer();
  this.vectorLayer = new VectorLayer({
      source: this.vectorSource // Set the vector source here
  });
  this.map = new Map({
    interactions: defaultInteractions().extend([
      new PinchZoom()
    ]),
    layers: [
      darkTileLayer,
      // this.tileLayer,
      this.vectorLayer
    ],
    view: new View({
      constrainResolution: true
    }),
    controls: defaultControls().extend([
      // new Attribution(),
      // new ZoomToExtent({ extent: this.extent }),
      new FullScreen()
    ])
  });

  this.map.on('singleclick', (event) => {
      this.handleMapClick(event);
  });

  const dragAndDropInteraction = new DragAndDrop({ formatConstructors: [GeoJSON] });

  dragAndDropInteraction.on('addfeatures', (event) => {

    const features = (event.features ?? []) as Feature<Geometry>[] | Collection<Feature<Geometry>> | undefined;
    const vectorSource = new VectorSource({ features });
    const vector: Vector = { name: event.file.name, source: vectorSource };

    this.vectorSources.push(vector);
    this.setVectorSource(vector);
  });

  this.map.addInteraction(dragAndDropInteraction);
  }

  /**
   * Updates zoom and center of the view.
   * @param zoom Zoom.
   * @param center Center in long/lat.
   */
  updateView(zoom = 2, center: [number, number] = [0, 0]): void {
    this.getUserLocation();
    this.map.getView().setZoom(zoom);
    this.map.getView().setCenter(fromLonLat(center));
  }

  /**
   * Updates target and size of the map.
   * @param target HTML container.
   */
  updateSize(target = 'map'): void {
    this.map.setTarget(target);
    this.map.updateSize();
  }

  /**
   * Sets the source of the tile layer.
   * @param source Source.
   */
  setTileSource(source = this.selectedTileSource): void {
    this.selectedTileSource = source;
    this.tileLayer.setSource(source.source);
  }

  /**
   * Sets the source of the vector layer.
   * @param source Source.
   */
  setVectorSource(source: Vector): void {
    this.vectorLayer.setSource(source.source);
    this.map.getView().fit(this.vectorLayer.getSource().getExtent());
  }

  // getUserLocation(): void {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const lat = position.coords.latitude;
  //         const lon = position.coords.longitude;
  //         const latLog = {
  //           lat,
  //           lng: lon,
  //         };
  //         const coordinates = fromLonLat([position.coords.longitude, position.coords.latitude]);
  //         this.map.getView().animate({ center: coordinates, zoom: 12 });
  //         this.addMarker(coordinates);
  //         this.addCircle(coordinates, 5000); // Add a 5 km radius circle around the clicked point

  //       },
  //       (error) => {
  //         console.error('Error getting location', error);
  //       }
  //     );
  //   } else {
  //     console.error('Geolocation is not supported by this browser.');
  //   }
  // }

  getUserLocation(): Promise<{ lat: number; lng: number; }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          // Convert to lat/lng from coordinates
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const coordinates = fromLonLat([position.coords.longitude, position.coords.latitude]);
          this.map.getView().animate({ center: coordinates, zoom: 12 });
          this.addMarker(coordinates);
          this.addCircle(coordinates, 5000); // Add a 5 km radius circle around the clicked point
          this.getNearByGardens(lat,lng,5000,'public');
          resolve({ lat, lng });
        }, reject);
      } else {
        reject('Geolocation not supported');
      }
    });
  }

  getNearByGardens(lat: any,long: any,radius: any,type: any) {
    this.supaService.getNearbyGardens(lat,long,radius,type).then((res: any)=> {
      console.log('gardens',res);
      this.gardens = res;
      this.showGardenOnMap(res);
    })
  }

    private addMarker(coordinates: any): void {

        this.vectorSource.clear(); // Clear all existing features

        const pointFeature = new Feature({
            geometry: new Point(coordinates),
        });

        pointFeature.setStyle(
            new Style({
                image: new Icon({
                    src: 'assets/marker.png', // Update to the correct path
                    scale: 0.3, // Adjust based on your needs
                }),
            })
        );

        this.vectorSource.addFeature(pointFeature); // Use the updated vector source
    }

    private handleMapClick(event: any): void {
        const coords = event.coordinate; // Get coordinates of the click event
        this.addMarker(coords); // Add marker at the clicked location
        this.addCircle(coords, 5000); // Add a 5 km radius circle around the clicked point
        const lonLat = toLonLat(coords); // Convert to lon/lat

        const lat = lonLat[1];
        const lng =   lonLat[0];
        this.getNearByGardens(lat,lng,5000,'public');

    }

        // New method to add a circle with a specified radius
        private addCircle(coordinates:any, radiusInMeters: number){
            // Create a circle with the specified radius
            const circle = new Circle(coordinates, radiusInMeters);
    
            // Create a feature for the circle
            const circleFeature = new Feature(circle);
    
            // Set the style for the circle
            circleFeature.setStyle(new Style({
                stroke: new Stroke({
                    color: 'white', // Outline color
                    width: 2, // Outline width
                }),
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.17)', // Fill color with transparency
                })
            }));
    
            // Add the circle feature to the vector source
            this.vectorSource.addFeature(circleFeature);
        }

        updateCircleRadius(filter: any,newRadiusInMeters: number): void {
          const currentLocation: any = this.vectorSource.getFeatures().find(feature => feature.getGeometry() instanceof Point);
      
          if (currentLocation) {
              // Get coordinates of the current point feature
              const coordinates = currentLocation.getGeometry().getCoordinates();
      
              // Clear existing features
              // this.clearExistingFeatures(); // Clear the previous point and circle
      
              // Add the Point back and the new circle with updated radius
              this.addMarker(coordinates); 
              this.addCircle(coordinates, newRadiusInMeters);
              const lonLat = toLonLat(coordinates); // Convert to lon/lat

      
              // Get the current view
              const view = this.map.getView();
              const currentZoom = view.getZoom();
              
              // Calculate a new zoom level based on the radius
              const newZoom = this.calculateZoomLevel(newRadiusInMeters);
      
              // Set the new zoom level and re-center the view
              view.animate({
                  zoom: newZoom,
                  duration: 500 // Adjust duration as needed
              });

              this.getNearByGardens(lonLat[1],lonLat[0],newRadiusInMeters,filter.category) ;

          }
      }
        
        private clearExistingFeatures(): void {
          this.vectorSource.clear();
      }

      // Helper method to calculate zoom level based on radius
private calculateZoomLevel(radiusInMeters: number): number {
  // You may need to adjust this logic based on your specific map projection,
  // For example, using some predefined zoom levels based on radius.
  
  const metersPerPixel = 156543.03; // Approximate meters per pixel at zoom level 0

  // Calculate the desired zoom level (approximation)
  const zoomLevel = Math.log2(40075017 / (radiusInMeters * 2)) + 0.5; // Rough calculation

  return Math.max(zoomLevel, 0); // Ensure zoom level doesn't go below 0
}

showGardenOnMap(gardens: any[]): void {
  // Clear existing features
  // this.vectorSource.clear();

  gardens.forEach(garden => {
    const coordinates = fromLonLat([garden.longitude, garden.latitude]); // Convert to LonLat
    const pointFeature = new Feature({
      geometry: new Point(coordinates),
    });

    // const img = garden.imageurls[0] || "assets/garden.png";
    // Set marker style including image if provided
    pointFeature.setStyle(
      new Style({
        image: new Icon({
          src: 'assets/garden.png', // Set this to an appropriate marker icon
          scale: 0.01, // Scale your icon size appropriately
        }),
      })
    );

    // Add garden details to the feature (you can use the garden.name to show a popup or tooltip later)
    pointFeature.setProperties({
      id: garden.id,
      name: garden.name,
      imageUrls: garden.imageurls[0]
    });

    // Add feature to vector source
    this.vectorSource.addFeature(pointFeature);
  });
}

}
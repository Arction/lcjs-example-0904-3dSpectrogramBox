/*
 * LightningChartJS example that showcases Box Series 3D to render a 3D spectrogram.
 */
// Import LightningChartJS
const lcjs = require('@arction/lcjs')

// Extract required parts from LightningChartJS.
const {
    lightningChart,
    ColorRGBA,
    LUT,
    PalettedFill,
    AxisScrollStrategies,
    UIElementBuilders,
    UIOrigins,
    UILayoutBuilders,
    UIBackgrounds,
    Themes
} = lcjs

const {
    createSpectrumDataGenerator
} = require('@arction/xydata')

// Length of single data sample.
const dataSampleSize = 60

// Length of data history.
const dataHistoryLength = 120

// Initial camera location.
const initialCameraLocation = {x: 0.10, y: 0.08, z: 1.2}


// Setup PalettedFill for dynamically coloring Boxes by an associated 'value' property.
const lut = new LUT( {
    steps: [
        { value: 15, color: ColorRGBA( 0, 0, 0 ) },
        { value: 30, color: ColorRGBA( 255, 255, 0 ) },
        { value: 45, color: ColorRGBA( 255, 204, 0 ) },
        { value: 60, color: ColorRGBA( 255, 128, 0 ) },
        { value: 100, color: ColorRGBA( 255, 0, 0 ) }
    ],
    units: 'dB',
    interpolate: true
} )
const paletteFill = new PalettedFill( { lut, lookUpProperty: 'y' } )


// Create Chart3D and configure Axes.
const chart3D = lightningChart().Chart3D({
    // theme: Themes.darkGold
})
    .setTitle( '3D Box Series Spectrogram' )
    .setBoundingBox( { x: 1, y: 1, z: 2 } )
chart3D.setCameraLocation( initialCameraLocation )
chart3D.getDefaultAxisY()
    .setScrollStrategy( AxisScrollStrategies.expansion )
    .setInterval( 0, 100 )
    .setTitle( 'Power spectrum P(f)' )
chart3D.getDefaultAxisX()
    .setTitle( 'Frequency (Hz)' )
chart3D.getDefaultAxisZ()
    .setTitle( 'Time' )
    .setInterval( 0, -dataHistoryLength )
    .setScrollStrategy( AxisScrollStrategies.progressive )


// Create Box Series 3D.
const boxSeries = chart3D.addBoxSeries()
    .setFillStyle( paletteFill )
    .setRoundedEdges( undefined )
    .setName('Spectrogram (box)')



// Create a data grid of Boxes which we can mutate without needing to create new Boxes for best performance.
const boxGrid = []
for ( let sampleIndex = 0; sampleIndex < dataHistoryLength; sampleIndex++ ) {
    const sampleBoxIDs = []
    for ( let i = 0; i < dataSampleSize; i++ ) {
        const id = sampleIndex * dataSampleSize + i
        // Add empty Box to series.
        boxSeries.invalidateData( [{
            id,
            yMin: 0,
            yMax: 0,
            zMin: 0,
            zMax: 0,
            // Box X coordinates don't have to change afterwards.
            xMin: i,
            xMax: i + 1.0
        }] )
        sampleBoxIDs.push( id )
    }
    boxGrid.push( sampleBoxIDs )
}

// Add LegendBox to chart.
const legend = chart3D.addLegendBox()
    // Dispose example UI elements automatically if they take too much space. This is to avoid bad UI on mobile / etc. devices.
    .setAutoDispose({
        type: 'max-width',
        maxWidth: 0.30,
    })
    .add(chart3D)


let sampleIndex = 0
createSpectrumDataGenerator()
    .setSampleSize( dataSampleSize )
    .setNumberOfSamples( dataHistoryLength )
    .setVariation( 5.0 )
    .generate()
    .setStreamRepeat( true )
    .setStreamInterval( 1000 / 60 )
    .setStreamBatchSize( 1 )
    .toStream()
    // Scale Y values from [0.0, 1.0] to [0.0, 80]
    .map( sample => sample.map( y => y * 80 ) )
    // Map Y values to a Row of Boxes.
    .forEach( sample => {
        const infiniteStreamingDataEnabled = toggleStreamingCheckBox.getOn()
        const addSample = infiniteStreamingDataEnabled || sampleIndex < dataHistoryLength

        if ( addSample ) {
            // Instead of making new Boxes each sample (slow), get the oldest row of Boxes that were created beforehand.
            const rowIndex = sampleIndex % dataHistoryLength
            const boxIDs = boxGrid[rowIndex]

            // Map Y values to BoxDataBounds format.
            const boxesData = sample.map( ( y, i ) => ( {
                id: boxIDs[i],
                yMin: 0,
                yMax: y,
                zMin: sampleIndex,
                zMax: sampleIndex + 1.0,
            } ) )
            boxSeries.invalidateData( boxesData )

            sampleIndex++
        }
    } )


// Animate Camera movement from file.
;(async () => {
    const cameraAnimationData = await (
        fetch( document.head.baseURI + 'examples/assets/lcjs_example_0904_3dSpectrogramBox-camera.json' )
            .then( r => r.json() )
    )
    if ( ! cameraAnimationData ) {
        console.log(`No Camera animation data.`)
        return
    }
    console.log(`Loaded Camera animation data.`)
    let frame = 0
    const nextFrame = () => {
        if ( cameraAnimationEnabledCheckbox.getOn() ) {
            const { cameraLocation } = cameraAnimationData.frames[Math.floor(frame) % cameraAnimationData.frames.length]
            chart3D.setCameraLocation( cameraLocation )
            frame += 2
        }
        requestAnimationFrame( nextFrame )
    }
    requestAnimationFrame( nextFrame )
})()



// * UI controls *
const group = chart3D.addUIElement( UILayoutBuilders.Column
    .setBackground( UIBackgrounds.Rectangle )
)
group
    .setPosition( { x: 0, y: 100 } )
    .setOrigin( UIOrigins.LeftTop )
    .setMargin( 10 )
    .setPadding( 4 )
    // Dispose example UI elements automatically if they take too much space. This is to avoid bad UI on mobile / etc. devices.
    .setAutoDispose({
        type: 'max-height',
        maxHeight: 0.30,
    })

// Add UI control for toggling between infinite streaming data and static data amount.
const handleStreamingToggled = ( state ) => {
    toggleStreamingCheckBox.setText( state ? 'Disable infinite streaming data' : 'Enable infinite streaming data' )
    if ( toggleStreamingCheckBox.getOn() !== state ) {
        toggleStreamingCheckBox.setOn( state )
    }
}
const toggleStreamingCheckBox = group.addElement( UIElementBuilders.CheckBox )
toggleStreamingCheckBox.onSwitch(( _, state ) => handleStreamingToggled( state ) )
handleStreamingToggled( true )

// Add UI control for toggling camera animation.
const handleCameraAnimationToggled = ( state ) => {
    cameraAnimationEnabledCheckbox.setText( state ? 'Disable camera animation' : 'Enable camera animation' )
    if ( cameraAnimationEnabledCheckbox.getOn() !== state ) {
        cameraAnimationEnabledCheckbox.setOn( state )
    }
}
const cameraAnimationEnabledCheckbox = group.addElement( UIElementBuilders.CheckBox )
cameraAnimationEnabledCheckbox.onSwitch((_, state) => handleCameraAnimationToggled( state ))
handleCameraAnimationToggled( true )
chart3D.onBackgroundMouseDrag(() => {
    handleCameraAnimationToggled( false )
})

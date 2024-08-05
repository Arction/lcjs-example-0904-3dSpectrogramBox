(self.webpackChunk=self.webpackChunk||[]).push([[524],{44:(e,t,a)=>{const s=a(377),n=a(613),{lightningChart:o,ColorRGBA:i,LUT:r,PalettedFill:l,AxisScrollStrategies:m,UIElementBuilders:d,UIOrigins:c,UILayoutBuilders:g,UIBackgrounds:u,regularColorSteps:h,Themes:x}=s,{createSpectrumDataGenerator:p}=n,S=120,f=o({resourcesBaseUrl:new URL(document.head.baseURI).origin+new URL(document.head.baseURI).pathname+"resources/"}).Chart3D({theme:x[new URLSearchParams(window.location.search).get("theme")||"darkGold"]||void 0}).setTitle("3D Box Series Spectrogram").setBoundingBox({x:1,y:1,z:2});f.setCameraLocation({x:.1,y:.08,z:1.2}),f.getDefaultAxisY().setScrollStrategy(m.expansion).setInterval({start:0,end:100,stopAxisAfter:!1}).setTitle("Power spectrum").setUnits("P(f)"),f.getDefaultAxisX().setTitle("Frequency").setUnits("Hz"),f.getDefaultAxisZ().setTitle("Time").setDefaultInterval((e=>({end:e.dataMax,start:(e.dataMax??0)-S,stopAxisAfter:!1}))).setScrollStrategy(m.progressive);const U=new l({lut:new r({steps:h(0,100,f.getTheme().examples.intensityColorPalette),units:"dB",interpolate:!0}),lookUpProperty:"y"}),y=f.addBoxSeries().setFillStyle(U).setRoundedEdges(void 0).setName("Spectrogram (box)"),w=[];for(let e=0;e<S;e++){const t=[];for(let a=0;a<60;a++){const s=60*e+a;y.invalidateData([{id:s,yMin:0,yMax:0,zMin:0,zMax:0,xMin:a,xMax:a+1}]),t.push(s)}w.push(t)}f.addLegendBox().setAutoDispose({type:"max-width",maxWidth:.3}).add(f);let B=0;p().setSampleSize(60).setNumberOfSamples(S).setVariation(5).generate().setStreamRepeat(!0).setStreamInterval(1e3/60).setStreamBatchSize(1).toStream().map((e=>e.map((e=>80*e)))).forEach((e=>{if(D.getOn()||B<S){const t=w[B%S],a=e.map(((e,a)=>({id:t[a],yMin:0,yMax:e,zMin:B,zMax:B+1})));y.invalidateData(a),B++}})),(async()=>{const e=await fetch(new URL(document.head.baseURI).origin+new URL(document.head.baseURI).pathname+"examples/assets/0904/camera.json").then((e=>e.json()));if(!e)return void console.log("No Camera animation data.");console.log("Loaded Camera animation data.");let t=0;const a=()=>{if(L.getOn()){const{cameraLocation:a}=e.frames[Math.floor(t)%e.frames.length];f.setCameraLocation(a),t+=2}requestAnimationFrame(a)};requestAnimationFrame(a)})();const M=f.addUIElement(g.Column.setBackground(u.Rectangle));M.setPosition({x:0,y:100}).setOrigin(c.LeftTop).setMargin(10).setPadding(4).setAutoDispose({type:"max-height",maxHeight:.3});const C=e=>{D.setText(e?"Disable infinite streaming data":"Enable infinite streaming data"),D.getOn()!==e&&D.setOn(e)},D=M.addElement(d.CheckBox);D.onSwitch(((e,t)=>C(t))),C(!0);const A=e=>{L.setText(e?"Disable camera animation":"Enable camera animation"),L.getOn()!==e&&L.setOn(e)},L=M.addElement(d.CheckBox);L.onSwitch(((e,t)=>A(t))),A(!0),f.onBackgroundMouseDrag((()=>{A(!1)}))}},e=>{e.O(0,[502],(()=>e(e.s=44))),e.O()}]);
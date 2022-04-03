# react-clicks

react-clicks is a React.js hook enabling easy management of various
click types(single, double & long) written in TypeScript.
Optimised for both desktop & mobile.

##### Table of contents
* **[Installation](#installation)**
* **[Usage](#usage)**
* Options
    * **[delayDoubleClick](#delaydoubleclick)**
    * **[delayLongClick](#delaylongclick)**
    * **[disableContextMenu](#disablecontextmenu)**
* **[Contributing](#contributing)**
* **[License](#license)**

<a name="installation"></a>
## Installation


```bash
npm install react-clicks

yarn add react-clicks
```

<a name="usage"></a>
## Usage
There's an `example/` project showing the most basic usage.
```typescript
import { useReactClicks } from 'react-clicks'

const App = () => {
  const clickProps = useReactClicks({
    singleClick: (e: ClickEventType) => {...},
    doubleClick: (e: ClickEventType) => {...},
    longClick: (e: ClickEventType) => {...}
  })
  
  return(
    <>
      <button {...clickProps}>I'm Hooked</button>  
    </>
  )
}
```

## Options

<a name="delaydoubleclick"></a>
### **delayDoubleClick**
###### Defaults to `200`
###### Expects `number`
###### *The amount of milliseconds required between the first & the second click in order to treat it as a double click*

<a name="delaylongclick"></a>
### **delayLongClick**
###### Defaults to `300`
###### Expects `number`
###### *The amount of milliseconds required to click down before it's treated as a long click*

<a name="disablecontextmenu"></a>
### **disableContextMenu**
###### Defaults to `true`
###### Expects `boolean`
###### *Disables the context menu on mobile & desktop*
If you don't disable the context menu, long clicks on mobile will open the mobile context menu.

<a name="contributing"></a>
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

<a name="license"></a>
## License
[MIT](https://choosealicense.com/licenses/mit/)
# 介绍

oh-popup 是一个帮助你编写弹出层的辅助库，目前支持 React、React Native、Taro。

这个库解决了一些「编写弹出层代码」时遇到的痛点，看到这里你可能会有疑惑：编写弹出层有什么痛点呢，不就是定义一个状态控制显示隐藏，传入一两个回调就可以了吗，这么自然且简单的流程有什么痛点呢？

来看一下我认为的痛点：

**1. 每一次使用弹出层组件时都要在 JSX 中定义组件和声明 visible 和回调函数，需要编写大量的重复代码且过程繁琐**

假设我们有一个 `选择城市的弹窗组件 <SelectCity>`，然后在 `编辑用户信息页` 需要用到：

```tsx | pure
import { SelectCity } from 'src/components/SelectCity'

export function UserSetting() {
  // 1.定义状态
  const [visible, setVisible] = useState(false)

  const openSelect = () => {
    setVisible(true)
  }

  // 2.定义获取城市信息的回调
  const onSelect = (city) => {
    // 在这里使用选择的城市信息
  }

  return (
    <div>
      <button onClick={openSelect}>选择城市</button>
      // 3.声明组件
      <SelectCity
        visible={visible}
        onSelect={onSelect}
        onClose={() => setVisible(false)}
      />
    </div>
  )
}
```

可以看到，我们在 `编辑用户信息页` 定义状态、定义获取城市的回调、定义组件，一起差不多 5-6 行代码，那么我们每多一个页面要使用这个弹窗组件就要重复写这些代码

那如果我们使用 oh-popup 呢？

```tsx | pure
import { SelectCity } from 'src/components/SelectCity'

export function UserSetting() {
  const openSelect = async () => {
    const city = await popupManager.open({
      el: <SelectCity />,
    })
    // 在这里使用选择的城市信息
  }

  return (
    <div>
      <button onClick={openSelect}>选择城市</button>
    </div>
  )
}
```

是的，只需要调用一个方法，考虑到可读性我们写成了两行，否则也可以写成一行

甚至我们可以把这个调用再封装一下，在选择城市组件中导出：

- src/components/SelectCity.tsx

```tsx | pure
// ...其他代码

export function openSelectCity() {
  return popupManager.open({
    el: <SelectCity />,
  })
}
```

然后再需要打开选择城市弹窗时，可以在代码中的任何位置调用 `openSelectCity()`，只需要一行代码

**2. 在组件之外打开弹出层时往往需要自己建立弹窗组件与外部 JS 代码的通信（全局状态、变量、事件等方式）**

继续以上面的例子为例，如果我们需要在组件之外打开选择城市的弹窗，往往需要自己建立组件与外部 JS 的通信：

- 事件的方式：

```tsx | pure
import { SelectCity } from 'src/components/SelectCity'

export function UserSetting() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // 监听事件
    event.on('openSelectCity', () => setVisible(true))
  }, [setVisible])
  // ...其他代码
}
```

- 全局状态

```tsx | pure
import { SelectCity } from 'src/components/SelectCity'

export function UserSetting() {
  // ...其他代码
  return (
    <SelectCity
      visible={appStore.selectCityVisible} // 使用具有响应式的全局状态
      onSelect={onSelect}
      onClose={() => setVisible(false)}
    />
  )
}
```

但如果我们使用 oh-popup 就可以在任何 JS 代码中随时打开弹出层，不需要自己做桥接：

```jsx | pure
const city = await openSelectCity()
```

**3. 多个弹出层联动打开时可想而知的没有可读性（在一个弹出层的回调中打开另一个弹出层然后在那个弹出层的回调中再打开另一个弹出层...）**

上面的例子中我们只有选择城市这一个弹窗，假如我们有多个弹窗需要联动，比如我们需要先弹窗选择省，然后根据省弹出选择城市弹窗选择城市，然后再根据城市选择行政区，我们的代码会写成什么样子呢：

```jsx | pure
export function UserSetting() {
  const [provinceVisible, setProvinceVisible] = useState(false)
  const [cityVisible, setCityVisible] = useState(false)
  const [areaVisible, setAreaVisible] = useState(false)
  const [province, setProvince] = useState()
  const [city, setCity] = useState()
  const [area, setArea] = useState()

  const onSelectProvince = (value)=>{
    setProvince(value)
    setCityVisible(true)
  }

  const onCityProvince = (value)=>{
    setCity(value)
    setAreaVisible(true)
  }

  const onSelectArea = (value)=>{
    // 在这里使用“行政区”数据
  }

  const openSelect = ()=>{
    setProvinceVisible(true)
  }

  return (
    <button onClick={openSelect}>选择行政区</button>
    <SelectProvince
      visible={provinceVisible}
      onSelect={onSelectProvince}
      onClose={() => setProvinceVisible(false)}
    />
    <SelectCity
      visible={cityVisible}
      onSelect={onSelectCity}
      onClose={() => setCityVisible(false)}
      province={province}
    />
    <SelectArea
      visible={areaVisible}
      onSelect={onSelectArea}
      onClose={() => setAreaVisible(false)}
      city={city}
    />
  )
}
```

如果使用 oh-popup 呢？

```jsx | pure
export function UserSetting() {
  const openSelect = async () => {
    const province = await openProvinceSelect()
    const city = await openCitySelect(province)
    const area = await openAreaSelect(city)
    // 在这里使用“行政区”数据
  }

  return <button onClick={openSelect}>选择行政区</button>
}
```

**4. 通过回调的方式获取弹出层的响应，回调中的代码与打开弹出层的代码不在同一个作用域**

上面依次选择 `省->城市->行政区` 这个例子中，我们的需求中其实只需要 `行政区` 数据而已，但是我们却创建了省和城市的状态用来在多个弹窗之间传递数据，这是因为弹窗的回调中的代码与打开弹窗时的代码不在同一个小的作用域中，我们需要借助共同的外部作用域或者其他方式(比如例子中的 useState)来在弹窗之间传递数据

而当我们使用 oh-popup 打开弹窗，它就是一个普通的 JS 函数而已，我们打开多个弹窗之后，代码仍然在同一个作用域中

```jsx | pure
const openSelect = async () => {
  const province = await openProvinceSelect() // 打开弹窗获取到省数据后依然在这个箭头函数的作用域中
  const city = await openCitySelect(province) // 于是我们很方便的就取到了省的数据并传递给了选择城市的弹窗
  const area = await openAreaSelect(city) // 之后的代码依然如此
  // 在这里使用“行政区”数据
}
```

我们再看一个「同一个作用域的好处」的例子，需求是这样的：

有一个用户信息列表，单击其中一项弹出一个弹窗来进行编辑，编辑完后列表要同步编辑后的信息

```tsx | pure
import { openUserFormPopup } from 'src/components/UserFormPopup'

export function UserSetting() {
  const users = useUsers()

  const onEdit = (user) => {
    const newUser = await openUserFormPopup(user)
    Object.assign(user, newUser)
  }

  return users.map((user) => (
    <UserItem user={user} onEdit={() => onEdit(user)} />
  ))
}
```

可以看到，我们获取编辑后的数据的代码依然在打开弹窗时的箭头函数中，这个箭头函数的作用域中还持有 user 的引用，所以我们可以直接把编辑后的数据同步到 user 中

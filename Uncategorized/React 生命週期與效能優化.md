# React 生命週期與效能優化

## 記錄

### useEffect vs useLayoutEffect 生命週期

`useEffect` 經常被我用在處理專案中的 side effect，但一直沒有深入的去理解它在 React lifecycle 中的定位，遇到一些情況就不知所措了，像是在 `useEffect` 中把 fetch 的資料 set 到某個 state 時畫面會閃一下，原來是因為 React 會先：

調用 Function（元件）-> 初始化元件內的 hooks（`useState`、`useRef` 等等） -> 更新 DOM 節點 -> 渲染瀏覽器的畫面，然後才會執行 `useEffect`，因此 `useState` 初始化的資料先被渲染到了畫面上，之後又在 `useEffect` 裡 setState 而重新渲染，導致不協調感。

`useLayoutEffect` 雖然很少使用，不過它可以完成一些 `useEffect` 做不到的事，因為它會在 DOM 變動之後立即被觸發，所以可以在瀏覽器還沒把 DOM 繪製到畫面之前處理東西。

### 優化

以前在考慮效能優化時，會覺得用 `useCallback`、`useMemo` 或 `memo` 就對了，沒仔細想過其實重新渲染還是會再宣告一個 function 後賦予給它們，而且為了記住原本的物件、函式也需額外的記憶體開銷，效能優化總是有成本，且帶來的好處不一定多過成本。

像是使用 `useCallback`：

```javascript
const dispenseCallback = React.useCallback((candy) => {
  setCandies((allCandies) => allCandies.filter((c) => c !== candy));
}, []);
```

其實等於：

```javascript
const dispense = (candy) => {
  setCandies((allCandies) => allCandies.filter((c) => c !== candy));
};
const dispenseCallback = React.useCallback(dispense, []);
```

而沒使用 `useCallback` 時：

```javascript
const dispense = (candy) => {
  setCandies((allCandies) => allCandies.filter((c) => c !== candy));
};
```

也許有時候保持原樣更好，或是採用 Dan Abramov 文章的 `children` 概念。
[Before You memo()](https://overreacted.io/zh-hant/before-you-memo/)

---

## 參考

- [useEffect vs useLayoutEffect](https://kentcdodds.com/blog/useeffect-vs-uselayouteffect)
- [When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback)
- [Before You memo()](https://overreacted.io/zh-hant/before-you-memo/)

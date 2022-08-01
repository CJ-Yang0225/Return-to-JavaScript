# SVG

## **viewport:**

SVG 的可視區域，可以想像成看電視的畫面，影像可以是任何尺寸，但能看到的東西局限於畫面的大小

```xml
<!-- viewport 1920 x 1080 (px) -->
<svg width="1920" height="1080">
  <!-- SVG content -->
</svg>
```

## **viewBox:**

SVG 真正的座標系統，可以想像成特寫鏡頭，特寫後的影像會縮放到電視畫面的大小

寫在 SVG 標籤上：`viewBox="<min-x> <min-y> <width> <height>"`

簡單來說：

`<min-x> <min-y>` 控制影像的位移（translate）

`<width> <height>` 控制影像的縮放（scale）

```xml
<!-- viewport 1920 x 1080 (px) | viewBox 960 x 540 (px) -->
<svg width="1920" height="1080" viewBox='0 0 960 540'>
  <!-- SVG content -->
</svg>
```

上述的例子中 `viewBox` 的寬高是 `viewport` 1/2 倍大，所以實際在 `viewport` 看到的 SVG 圖示單位會變為原來 2 倍；若 `viewBox` 的寬高是 `viewport` 2 倍大，則 SVG 圖示會變為原來的 1/2 倍。

## **preserveAspectRatio:**

`preserveAspectRatio` 的目的在於維持 `viewBox` 縮放後的比例，因此 `viewport` 和 `viewBox` 寬高比一樣時，`preserveAspectRatio` 看不出來效果。

語法：

`preserveAspectRatio="<align> [<meetOrSlice>]"`

```xml
<svg ...省略... preserveAspectRatio="xMinYMax slice">
  <!-- SVG content -->
</svg>

```

`align` 可以設為 `none` 可以不固定 `viewBox` 比例，填滿整個 `viewport`

```xml
<svg ...省略... preserveAspectRatio="none">
  <!-- SVG content -->
</svg>

```


第一部分 `align` 的值（任意 x 和任意 y 組合）：

| `align`(x) | 含義                           |
| ---------- | ------------------------------ |
| xMin       | viewBox 對齊 viewport X 軸左邊 |
| xMid       | viewBox 對齊 viewport X 軸中心 |
| xMax       | viewBox 對齊 viewport X 軸右邊 |

| `align`(y) | 含義                           |
| ---------- | ------------------------------ |
| YMin       | viewBox 對齊 viewport Y 軸上方 |
| YMid       | viewBox 對齊 viewport Y 軸中心 |
| YMax       | viewBox 對齊 viewport Y 軸下方 |

第二部分 `meetOrSlice` 的值：

| `meetOrSlice`  | 含義                                                                      |
| -------------- | ------------------------------------------------------------------------- |
| meet (default) | 保持比例並讓 viewBox 完整呈現在 viewport（類 `background-size: contain`） |
| slice          | 保持比例並讓 viewBox 填滿全部的 viewport （類 `background-size: cover`）  |

## 參考

[The viewport, viewBox, and preserveAspectRatio](https://www.sarasoueidan.com/blog/svg-coordinate-systems/)

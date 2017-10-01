# notatsukinotanoshi
No tatsuki No Tanoshi!

# Specifications
Framework `.NET Core 2.1.1 MVC`  
Scripts
```
PHP 7.0
ASP.NET MVC 4
```

# Git flow
`master` 已經被鎖定，所有操作必須根據流程進行。  


## Branching
新功能：`feature/名稱`  
修正：`hotfix/名稱`  
發怖：`release/版本`  

## Flow
### Before Started
進行修改前，請根據上述`branch`命名方產生新`branch`並`checkout`，避免失去工作進度。

### Updating master
1. 完成工作以後，必須在GitHub網頁上發怖新[Pull Request (PR)](https://github.com/tnsogs02/notatsukinotanoshi/pulls)，並請求最少一人過目。  
檢查並不需要細閱代碼，但是必須確保沒有未被修正的Merge conflict，以下是一個Merge conflict的例子，這個將會造成系統運行失敗，所以必須留意。 `HEAD`下方的內容是目前repo的代碼，`branch`上方則是你的代碼，請自行斟酌要使用哪一段，或者適當地合拼代碼。
```
<<<<<<< HEAD
open an issue
=======
ask your question in IRC.
>>>>>>> branch-a
```

2. 修正所有Merge conflict後，reviewer可以在PR頁面的右上方選`Review Pull Request`，輸入內容後Approve，PR就此完成。
3. 最後，如果系統沒有顯示Merge conflict，就可以直接進行`merge`。Review後不必馬上進行merge，可以在此進行改進，直至滿意。
4. 完成Merge後，請順便Delete branch，以防止冗餘數據積蓄。

# Usage
### Helper classes
`bundleconfig.json`: 負責產生並minify代碼

## Authors
* [ Place Holder ]
* [ Place Holder ]
* [ Place Holder ]
* Sakura - Initial Work - [lamyauping](https://github.com/lamyauping)

## License
Refer to license

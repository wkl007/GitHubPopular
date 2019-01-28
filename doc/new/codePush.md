### 1.发布正式版本命令

```javascript
code-push release-react GitHubPopular-Android android -t 1.0.0 --dev false -d Production --des "codePush了解一下" --m true
```

### 2.发布测试版本命令

```javascript
code-push release-react GitHubPopular-Android android -t 1.0.0 --dev false -d Staging --des "codePush了解一下" --m true
```

### 3.查看已发布版本

```javascript
code-push deployment ls GitHubPopular-Android
```


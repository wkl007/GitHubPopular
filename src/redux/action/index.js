import { onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite } from './popular'
import { onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite } from './trending'
import { onLoadFavoriteData } from './favorite'
import { onLoadLanguage } from './language'
import { onThemeChange, onShowCustomThemeView, onThemeInit } from './theme'

export default {
  onRefreshPopular,
  onLoadMorePopular,
  onFlushPopularFavorite,
  onRefreshTrending,
  onLoadMoreTrending,
  onFlushTrendingFavorite,
  onLoadFavoriteData,
  onLoadLanguage,
  onThemeChange,
  onShowCustomThemeView,
  onThemeInit
}

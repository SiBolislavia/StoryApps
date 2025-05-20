import { getAllBookmarks, removeBookmark } from '../../utils/indexeddb.js';
import { generateBookmarkItemTemplate } from '../../templates.js';

export default class BookmarkPage {
  #bookmarks = [];

  async render() {
    return `
      <section class="bookmark-page">
        <h1 class="section-title">Bookmark</h1>
        <div id="bookmark-list"></div>
      </section>
    `;
  }

  async afterRender() {
    await this._loadBookmarks();
    this._setupDeleteBookmarkHandler();
  }

  async _loadBookmarks() {
    this.#bookmarks = await getAllBookmarks();
    this._renderBookmarks();
  }

  _renderBookmarks() {
    const container = document.getElementById('bookmark-list');
    if (!container) return;

    if (this.#bookmarks.length === 0) {
      container.innerHTML = '<p>Tidak ada bookmark yang disimpan.</p>';
      return;
    }

    container.innerHTML = this.#bookmarks
      .map((story) => generateBookmarkItemTemplate(story))
      .join('');
  }

  _setupDeleteBookmarkHandler() {
    const container = document.getElementById('bookmark-list');
    if (!container) return;

    container.addEventListener('click', async (event) => {
      if (event.target.classList.contains('btn-delete-bookmark')) {
        const storyId = event.target.getAttribute('data-id');
        if (!storyId) return;

        await removeBookmark(storyId);
        await this._loadBookmarks();
      }
    });
  }
}

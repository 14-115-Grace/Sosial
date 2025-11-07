# FORUM-DISKUSI

Anjay mabar backend

Ini, file "backend" nya. filenya .js tinggal pake.

intinya udah rapih jadi tinggal di pake aja fungsi nya.

Cara Pakainya? Gampang.
Salin: Kalian tinggal salin semua file .js ini (auth.js, posts.js, comments.js, dll.) ke folder proyek frontend.

Install: Jangan lupa npm install @supabase/supabase-js.

Impor & Panggil: Di kode UI, tinggal impor fungsi yang dibutuhin terus panggil aja.

Contoh (Halaman Login): Di file login.js, impor loginUser dari auth.js. Pas tombol "Masuk" diklik, panggil aja await loginUser(email, password). Beres. Dia yang ngurus sisanya.

🧰 "Kotak Ajaib"
Ini daftar semua "alat" yang ada di dalemnya, udah di bagi per file:

1. auth.js (Urusan Akun & Profil)
registerUser(fullName, email, password, handle): Buat daftar. PENTING: UI wajib nambahin satu field buat @handle (username) !

loginUser(email, password): Buat login.

logoutUser(): Buat tombol "Keluar".

updateUserPassword(newPassword): Buat ganti password di "Pengaturan".

sendPasswordResetEmail(email): Untuk kirim email Lupa Password.

getUserProfile(userId): PENTING! Panggil ini buat halaman profil. Udah otomatis dapet semua (avatar_url, banner_url, handle, bio, dan JUMLAH follower/following).

updateProfile(profileData): Buat update profil (kirim aja objek, misal: { bio: "Halo" }).

uploadAvatar(file) & uploadBanner(file): Buat upload gambar profil/banner. Udah otomatis ke-upload DAN ke-simpan ke profil (satu langkah).

2. posts.js (Urusan Postingan & Feed)
getPosts(page = 1, limit = 10): Ini buat feed utama (udah ada paginasi). Udah dapet semua (info user, like_count, comment_count).

createPost(content, categoryNames = []): Buat post baru. Bisa lempar array tag, misal: ["EtikaAI"].

updatePost(postId, newContent): Edit post.

deletePost(postId): Hapus post.

searchPosts(queryText, page = 1, limit = 10): Buat search bar (udah ada paginasi). Hasilnya sama persis kayak getPosts().

getLikedPosts(userId, page = 1, limit = 10): Buat tab "Disukai" (udah ada paginasi). Hasilnya juga sama kayak getPosts().

3. comments.js (Urusan Komentar)
getCommentsForPost(postId, page = 1, limit = 10): Ambil semua komen di satu post (udah ada paginasi, udah ada info user & like_count-nya).

createComment(postId, content): Buat komen. (Otomatis bikin notif).

updateComment(commentId, newContent): Edit komen.

deleteComment(commentId): Hapus komen.

likeComment(commentId) & unlikeComment(commentId): Buat like/unlike di komentar. (Otomatis bikin notif).

4. likes.js (Like di Postingan)
likePost(postId) & unlikePost(postId): Buat like/unlike di post. (Otomatis bikin notif).

getUsersWhoLikedPost(postId, page = 1, limit = 20): Ambil daftar siapa aja yang nge-like (udah ada paginasi).

5. follows.js (Sistem Follow)
followUser(userIdToFollow) & unfollowUser(userIdToUnfollow): Buat follow/unfollow. (Otomatis bikin notif).

getFollowersList(userId, page = 1, limit = 20): Ambil daftar followers (udah ada paginasi).

getFollowingList(userId, page = 1, limit = 20): Ambil daftar following (udah ada paginasi).

6. categories.js (Tagar & Tren)
getTrendingTags(limit = 5): Panggil ini buat "Tren Hari Ini". Udah otomatis urut dan ada jumlah post-nya.

getAllCategories(): Ambil semua tag (kalau kalian mau bikin autocomplete).

7. notifications.js (Urusan Notif Lonceng)
getNotifications(page = 1, limit = 15): Ambil semua notif (buat ikon lonceng). Udah ada paginasi.

markNotificationAsRead(notificationId): Buat nandain satu notif udah dibaca (pas diklik).

markAllNotificationsAsRead(): Buat tombol "Tandai semua dibaca".

8. blocks.js (Fitur Blokir User)
blockUser(userIdToBlock): Buat nge-blok user.

unblockUser(userIdToUnblock): Buat batalin blokir.

CATATAN PENTING: Kalian nggak perlu pusing mikirin filternya. Semua fungsi list (kayak getPosts, getCommentsForPost, getFollowersList, dll.) udah otomatis nge-filter user yang diblokir. It just works.

Gacor!
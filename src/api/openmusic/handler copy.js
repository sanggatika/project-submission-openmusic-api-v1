const { nanoid } = require('nanoid');

const songs = require('../../services/inMemory/OpenMusicService');

const addOpenMusicHandler = (request, h) => {
  // Body Request
  const {
    title,
    year,
    performer,
    genre,
    duration,
  } = request.payload;

  // ID Nilai Unik Dengan Menggunakan nanoid
  const id = `song-${nanoid(16)}`;
  // eslint-disable-next-line max-len
  // merupakan properti yang menampung tanggal dimasukkannya buku. menggunakan new Date().toISOString()
  const insertedAt = new Date().toISOString();
  // Ketika buku baru dimasukkan, berikan nilai properti ini sama dengan insertedAt
  const updatedAt = insertedAt;

  // Client tidak melampirkan properti namepada request body
  if (!title) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan Lagu. Mohon isi title lagu',
    });
    response.code(400);
    return response;
  }

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(year)) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan Lagu. Tahun Lagu Harus Number',
    });
    response.code(400);
    return response;
  }

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(duration)) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan Lagu. Duration Lagu Harus Number',
    });
    response.code(400);
    return response;
  }

  const newSongs = {
    id, title, year, performer, genre, duration, insertedAt, updatedAt,
  };

  // masukan nilai-nilai tersebut ke dalam array OpenMusicService.js menggunakan method push()
  songs.push(newSongs);

  const isSuccess = songs.filter((song) => song.id === id).length > 0;

  if (isSuccess) {
    // Jika buku berhasil diambahkan
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId: id,
      },
    });
    response.code(201);
    return response;
  }

  // Server gagal memasukkan buku karena alasan umum (generic error)
  const response = h.response({
    status: 'fail',
    message: 'Lagu gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllOpenMusicHandler = (request, h) => {
  // mengecek data pada OpenMusicService.js
  // eslint-disable-next-line camelcase
  const tmp_length = songs.length;

  // eslint-disable-next-line camelcase
  if (tmp_length > 0) {
    // fitur query parameters pada route GET / songs (Mendapatkan seluruh lagu)
    const { title } = request.query;

    // menampung filter
    let filterSongs = songs;

    if (title) {
      filterSongs = filterSongs.filter((song) => song
        .title.toLowerCase().includes(title.toLowerCase()));
    }

    // Jika Kondisi OpenMusicService.js Terdapat Data
    const response = h.response({
      status: 'success',
      data: {
        songs: filterSongs.map((song) => ({
          id: song.id,
          title: song.title,
          performer: song.performer,
        })),
      },
    });
    response.code(200);
    return response;
  }
  // Jika Kondisi OpenMusicService.js Tidak Terdapat Data
  const response = h.response({
    status: 'success',
    data: {
      songs,
    },
  });
  response.code(200);
  return response;
};

const getOpenMusicByIdHandler = (request, h) => {
  // menampung id data
  const { id } = request.params;

  // mencari data
  const song = songs.filter((b) => b.id === id)[0];

  // Jika Book Ditemukan Tidak Null
  if (song !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        song,
      },
    });
    response.code(200);
    return response;
  }

  // Kondisi Jika Buka Tidak Ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Lagu tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editOpenMusicByIdHandler = (request, h) => {
  // menampung id data
  const { id } = request.params;

  // mencari data
  const song = songs.filter((b) => b.id === id)[0];

  // Jika Book ID Ditemukan
  if (song !== undefined) {
    // Body Request
    const {
      title,
      year,
      performer,
      genre,
      duration,
    } = request.payload;

    // Client tidak melampirkan properti namepada request body
    if (!title) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal mengedit lagu. Mohon isi title lagu',
      });
      response.code(400);
      return response;
    }

    const updatedAt = new Date().toISOString();

    const index = songs.findIndex((book) => book.id === id);

    if (index !== -1) {
      songs[index] = {
        ...songs[index],
        title,
        year,
        performer,
        genre,
        duration,
        updatedAt,
      };

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil diperbarui',
      });
      response.code(200);
      return response;
    }
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui Lagu. Data tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  // Kondisi Jika Buka Tidak Ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui Lagu. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteOpenMusicByIdHandler = (request, h) => {
  // menampung id data
  const { id } = request.params;

  const index = songs.findIndex((song) => song.id === id);

  if (index !== -1) {
    songs.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Lagu gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  // eslint-disable-next-line max-len
  addOpenMusicHandler, getAllOpenMusicHandler, getOpenMusicByIdHandler, editOpenMusicByIdHandler, deleteOpenMusicByIdHandler,
};

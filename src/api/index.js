import {get,post} from "./http";
/**
 * 判断管理员是否登录成功
 */
export const getLoginStatus = (params) => post(`admin/login/status`, params);

//==============================================歌手相关====================================================
/**
 * 添加歌手
 */
export const setSinger = (params) => post(`singer/add`, params);

/**
 * 查询所有歌手
 */
export const getAllSinger = () => get(`singer/allSinger`);

/**
 * 修改歌手
 */
export const updateSinger = (params) => post(`singer/update`, params);

/**
 * 删除歌手
 */
export const delSinger = (id) => get(`singer/delete?id=${id}`);


//==============================================歌曲相关====================================================
/**
 * 根据歌手Id查询歌曲
 */
export const songOfSingerId = (id) => get(`song/singer/detail?singerId=${id}`)

/**
 * 更新歌曲
 */
export const updateSong = (params) => post(`song/update`, params)

/**
 * 删除歌曲
 */
export const delSong = (id) => get(`song/delete?id=${id}`);

/**
 * 根据songId找到对应的歌曲对象
 */
export const songOfSongId = (id) => get(`song/songOfSongId?songId=${id}`);

/**
 * 根据songName找到对应的歌曲对象
 */
export const songOfSongName = (songName) => get(`song/songOfSongName?songName=${songName}`);

/**
 * 查询所有歌曲
 */
export const allSong = () => get(`song/allSong`);


//==============================================歌单相关====================================================
/**
 * 添加歌单
 */
export const setSongList = (params) => post(`songList/add`, params);

/**
 * 查询歌单
 */
export const getAllSongList = () => get(`songList/allSongList`);

/**
 * 修改歌单
 */
export const updateSongList = (params) => post(`songList/update`, params);

/**
 * 删除歌单
 */
export const delSongList = (id) => get(`songList/delete?id=${id}`);

//======================================歌单歌曲相关========================================
/**
 * 根据歌单id查询歌曲列表
 */
export const listSongDetail = (songListId) => get(`listSong/detail?songListId=${songListId}`);

/**
 * 给歌单增加歌曲
 */
export const listSongAdd = (params) => post(`listSong/add`, params);

/**
 * 删除歌单里面的一首歌曲
 */
export const delListSong = (songId, songListId) => get(`listSong/delete?songId=${songId}&songListId=${songListId}`);


//======================================用户相关========================================
/**
 * 查询所有前端用户
 */
export const getAllConsumer = () => get(`consumer/allConsumer`);

/**
 * 修改用户
 */
export const updateConsumer = (params) => post(`consumer/update`, params);

/**
 * 添加用户
 */
export const setConsumer = (params) => post(`consumer/add`, params);

/**
 * 删除用户
 */
export const delConsumer = (id) => get(`consumer/delete?id=${id}`);


















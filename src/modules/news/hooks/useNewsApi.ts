import { NewModel } from 'common/enum/new-model';
import { BaseResponse } from 'common/model/base-response';
import api from 'hooks/api';
import useSWR from 'swr';

export const useNewsApi = () => {
  const _fetchNews = async () => {
    return api.POST<BaseResponse<BaseResponse<NewModel[]>>>({
      path: '/api/models/blog-post/execute/get_blog_posts_api',
      data: {},
    });
  };

  const { data: news } = useSWR('news', _fetchNews);

  return {
    news: news?.data,
  };
};

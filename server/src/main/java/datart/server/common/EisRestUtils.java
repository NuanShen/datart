package datart.server.common;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import datart.core.common.Application;
import datart.core.common.Cache;
import datart.core.common.CacheFactory;
import datart.server.base.params.EisMenuParam;
import okhttp3.*;

import java.io.IOException;

public class EisRestUtils {

    /**
     * 默认的EIS地址
     */
    private static String HOST = Application.getProperty("datart.eis.host");

    /**
     * 系统ID
     */
    private static final String SYSID = Application.getProperty("datart.eis.sysid");

    /**
     * 系统密钥
     */
    private static final String SYSSECRET = Application.getProperty("datart.eis.syssecret");

    /**
     * token过期时间
     */
    private static final int EXPIRES = 7000;

    public static String getToken() {
        try {
            Cache cache = CacheFactory.getCache();
            assert cache != null;
            Object eisToken = cache.get("EIS_TOKEN");
            if (eisToken != null) {
                return eisToken.toString();
            } else {
                OkHttpClient client = new OkHttpClient().newBuilder().build();
                Request request = new Request.Builder()
                        .url(String.format("%s/gettoken?sysid=%s&syssecret=%s", (HOST.endsWith("api") ? HOST : HOST + "/api"), SYSID, SYSSECRET))
                        .method("GET", null)
                        .addHeader("User-Agent", "Datart/1.0.0 (https://datart.tydic.com)")
                        .addHeader("Accept", "*/*")
                        .addHeader("Connection", "keep-alive")
                        .build();
                try (Response response = client.newCall(request).execute()) {
                    ResponseBody body = response.body();
                    if (response.isSuccessful() && body != null) {
                        String token = JSONObject.parseObject(body.string()).getJSONObject("result").getString("token");
                        cache.put("EIS_TOKEN", token, EXPIRES);
                        return token;
                    } else {
                        throw new RuntimeException("获取EIS Token失败");
                    }
                }
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static JSONObject generateEisMenu(EisMenuParam eisMenu) {
        try {
            String token = getToken();
            OkHttpClient client = new OkHttpClient().newBuilder().build();
            MediaType mediaType = MediaType.parse("application/json");
            RequestBody body = RequestBody.create(mediaType, JSONObject.toJSONString(eisMenu));
            Request request = new Request.Builder()
                    .url(String.format("%s/pri/menu/add", HOST))
                    .method("POST", body)
                    .addHeader("Authorization", String.format("Bearer %s", token))
                    .addHeader("User-Agent", "Datart/1.0.0 (https://datart.tydic.com)")
                    .addHeader("Content-Type", "application/json")
                    .addHeader("Accept", "*/*")
                    .addHeader("Connection", "keep-alive")
                    .build();
            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    throw new RuntimeException(response.message());
                }

                assert response.body() != null;
                JSONObject jsonObject = JSONObject.parseObject(response.body().string());
                if (!jsonObject.getBoolean("success")) {
                    throw new RuntimeException(jsonObject.getString("errorMsg"));
                }

                JSONObject result = jsonObject.getJSONObject("result");
                if (!result.getBoolean("success")) {
                    throw new RuntimeException(result.getString("errorMsg"));
                }

                return result.getJSONObject("result");
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static JSONArray getRoleTree(String username) throws Exception {
        String token = getToken();
        OkHttpClient client = new OkHttpClient().newBuilder().build();
        Request request = new Request.Builder()
                .url(String.format("%s/pri/menu/roleTree?username=%s&", HOST, username))
                .method("GET", null)
                .addHeader("Authorization", String.format("Bearer %s", token))
                .addHeader("User-Agent", "Datart/1.0.0 (https://datart.tydic.com)")
                .addHeader("Accept", "*/*")
                .addHeader("Connection", "keep-alive")
                .build();
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new RuntimeException(response.message());
            }

            assert response.body() != null;
            JSONObject jsonObject = JSONObject.parseObject(response.body().string());
            if (!jsonObject.getBoolean("success")) {
                throw new RuntimeException(jsonObject.getString("errorMsg"));
            }

            JSONObject result = jsonObject.getJSONObject("result");
            if (!result.getBoolean("success")) {
                throw new RuntimeException(result.getString("errorMsg"));
            }

            return result.getJSONArray("result");
        }
    }

}

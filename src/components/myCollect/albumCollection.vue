<!-- <template>
    <div v-if="albums">
        <h3 style="margin-bottom: 10px;"> 找到 {{ albumsObj.albumCount }} 张专辑</h3>
        <div class="albumsContainer" v-for="(item, i) in albumsObj.albums" :key="i">
            <RouterLink class="link" :to="`/albumDetail/${item.id}`" sty>
                <img class="pic" :src="item.picUrl" alt="">
                <div class="nameContainer">
                    <span class="uname">{{ item.name }}</span>
                    <span class="name">{{ item.artist.name }}</span>
                </div>
            </RouterLink>

        </div>
    </div>
</template> -->
/* src/app/page.tsx */
"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

// --- Types ---
type Character = {
  id: number;
  name: string;
  img: string;
};

type TeamMember = Character & {
  chain: number;
};

type Team = {
  id: number;
  name: string;
  score: string;
  members: TeamMember[];
};

// --- Mock Data ---
const CHARACTERS: Character[] = [

  { id: 1, name: "忌炎", img: "./avatar/T_IconRoleHead256_11_UI.webp" },
  { id: 1, name: "吟霖", img: "./avatar/T_IconRoleHead256_17_UI.webp" },
  { id: 1, name: "今汐", img: "./avatar/T_IconRoleHead256_24_UI.webp" },
  { id: 1, name: "长离", img: "./avatar/T_IconRoleHead256_26_UI.webp" },
  { id: 1, name: "折枝", img: "./avatar/T_IconRoleHead256_27_UI.webp" },
  { id: 1, name: "相里要", img: "./avatar/T_IconRoleHead256_25_UI.webp" },
  { id: 1, name: "守岸人", img: "./avatar/T_IconRoleHead256_28_UI.webp" },
  { id: 1, name: "椿", img: "./avatar/T_IconRoleHead256_29_UI.webp" },
  { id: 1, name: "珂莱塔", img: "./avatar/T_IconRoleHead256_32_UI.webp" },
  { id: 1, name: "洛可可", img: "./avatar/T_IconRoleHead256_33_UI.webp" },
  { id: 1, name: "菲比", img: "./avatar/T_IconRoleHead256_45_UI.webp" },
  { id: 2, name: "布兰特", img: "./avatar/T_IconRoleHead256_44_UI.webp" },
  { id: 3, name: "坎特蕾拉", img: "./avatar/T_IconRoleHead256_34_UI.webp" },
  { id: 4, name: "赞妮", img: "./avatar/T_IconRoleHead256_38_UI.webp" },
  { id: 5, name: "夏空", img: "./avatar/T_IconRoleHead256_37_UI.webp" },
  { id: 6, name: "卡提希娅", img: "./avatar/T_IconRoleHead256_40_UI.webp" },
  { id: 7, name: "露帕", img: "./avatar/T_IconRoleHead256_46_UI.webp" },
  { id: 8, name: "弗洛洛", img: "./avatar/T_IconRoleHead256_41_UI.webp" },
  { id: 8, name: "奥古斯塔", img: "./avatar/T_IconRoleHead256_51_UI.webp" },
  { id: 8, name: "尤诺", img: "./avatar/T_IconRoleHead256_48_UI.webp" },
  { id: 8, name: "嘉贝莉娜", img: "./avatar/T_IconRoleHead256_55_UI.webp" },
  { id: 8, name: "仇远", img: "./avatar/T_IconRoleHead256_56_UI.webp" },
  { id: 8, name: "千咲", img: "./avatar/T_IconRoleHead256_57_UI.webp" },
  { id: 8, name: "琳奈", img: "./avatar/T_IconRoleHead256_60_UI.webp" },
  { id: 8, name: "莫宁", img: "./avatar/T_IconRoleHead256_61_UI.webp" },
  { id: 8, name: "漂泊者", img: "./avatar/T_IconRoleHead256_4_UI.webp" },
  { id: 8, name: "漂泊者", img: "./avatar/T_IconRoleHead256_5_UI.webp" },
  { id: 8, name: "桃祈", img: "./avatar/T_IconRoleHead256_9_UI.webp" },
  { id: 8, name: "渊武", img: "./avatar/T_IconRoleHead256_15_UI.webp" },
  { id: 8, name: "莫特斐", img: "./avatar/T_IconRoleHead256_13_UI.webp" },
  { id: 8, name: "丹瑾", img: "./avatar/T_IconRoleHead256_10_UI.webp" },
  { id: 8, name: "秋水", img: "./avatar/T_IconRoleHead256_12_UI.webp" },
  { id: 8, name: "散华", img: "./avatar/T_IconRoleHead256_7_UI.webp" },
  { id: 8, name: "炽霞", img: "./avatar/T_IconRoleHead256_2_UI.webp" },
  { id: 8, name: "白芷", img: "./avatar/T_IconRoleHead256_6_UI.webp" },
  { id: 8, name: "釉瑚", img: "./avatar/T_IconRoleHead256_31_UI.webp" },
  { id: 8, name: "秧秧", img: "./avatar/T_IconRoleHead256_1_UI.webp" },
  { id: 8, name: "灯灯", img: "./avatar/T_IconRoleHead256_30_UI.webp" },
  { id: 8, name: "卜灵", img: "./avatar/T_IconRoleHead256_58_UI.webp" },
  { id: 8, name: "鉴心", img: "./avatar/T_IconRoleHead256_23_UI.webp" },
  { id: 8, name: "卡卡罗", img: "./avatar/T_IconRoleHead256_18_UI.webp" },
  { id: 8, name: "凌阳", img: "./avatar/T_IconRoleHead256_14_UI.webp" },
  { id: 8, name: "维里奈", img: "./avatar/T_IconRoleHead256_3_UI.webp" },
  { id: 8, name: "安可", img: "./avatar/T_IconRoleHead256_8_UI.webp" },

];

const CHAIN_MAP = ["零链", "一链", "二链", "三链", "四链", "五链", "六链"];
const CHINESE_NUM = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

// --- Components ---

// 1. 卡片组件
function TeamCard({ team }: { team: Team; }) {
  return (
    <div className="team-card flex-grow">
      <div className="team-info">
        <div className="team-name">{team.name}</div>
        <div className="team-score">{team.score}</div>
      </div>
      <div className="hero-group">
        {team.members.map((member, idx) => (
          <div key={idx} className="hero-avatar-container">
            <div className="hero-ring">
              <img src={member.img} className="hero-img" alt={member.name} />
            </div>
            <div className="chain-tag">{CHAIN_MAP[member.chain]}</div>
            <div className="name-tag">{member.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. 主页面
export default function Home() {
  // 状态：队伍列表
  const [teams, setTeams] = useState<Team[]>([
    {
      id: 1,
      name: "队伍一",
      score: "2220",
      members: [
        { ...CHARACTERS[0], chain: 2 },
        { ...CHARACTERS[1], chain: 0 },
        { ...CHARACTERS[2], chain: 3 },
      ],
    },
  ]);

  // 状态：弹窗控制
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCharListOpen, setIsCharListOpen] = useState(false);

  // 状态：正在编辑的新队伍数据
  const [score, setScore] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<(TeamMember | null)[]>([null, null, null]);
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number | null>(null);

  // 打开主弹窗
  const handleOpenModal = () => {
    setScore("");
    setSelectedMembers([null, null, null]);
    setIsModalOpen(true);
  };

  // 保存队伍
  const handleSave = () => {
    if (!score) return alert("请填写分数");
    if (selectedMembers.some((m) => m === null)) return alert("请完整选择3个角色");

    const newTeamCount = teams.length + 1;
    const teamName = `队伍${CHINESE_NUM[newTeamCount] || newTeamCount}`;

    const newTeam: Team = {
      id: Date.now(),
      name: teamName,
      score,
      members: selectedMembers as TeamMember[],
    };

    setTeams([...teams, newTeam]);
    setIsModalOpen(false);
  };

  // 删除队伍
  const handleDeleteTeam = (id: number) => {
    if (window.confirm("确定要删除这个队伍吗？")) {
      setTeams(teams.filter(team => team.id !== id));
    }
  };

  // 打开角色选择
  const handleSlotClick = (index: number) => {
    setCurrentSlotIndex(index);
    setIsCharListOpen(true);
  };

  // 选中角色
  const handleSelectChar = (char: Character) => {
    if (currentSlotIndex === null) return;

    const newMembers = [...selectedMembers];
    newMembers[currentSlotIndex] = { ...char, chain: 0 }; // 默认0链
    setSelectedMembers(newMembers);
    setIsCharListOpen(false);
  };

  // 修改链度
  const handleChainChange = (index: number, chain: number) => {
    const newMembers = [...selectedMembers];
    if (newMembers[index]) {
      newMembers[index] = { ...newMembers[index]!, chain };
      setSelectedMembers(newMembers);
    }
  };

  return (
    <main style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <h2>矩阵叠兵</h2>
      </div>

      <div id="team-list" className="space-y-4">
        {teams.map((team) => (
          <div key={team.id} className="flex items-center w-full gap-4">
            <TeamCard team={team} />
          </div>
        ))}
      </div>

      {/* 悬浮添加按钮 */}
      <button className="fab-btn" onClick={handleOpenModal}>
        +
      </button>

      {/* 弹窗遮罩 */}
      {
        isModalOpen && (
          <div className="modal-overlay" id="addModal" onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
            <div className="modal" style={{ position: 'relative', overflow: 'hidden' }}>
              <h3>添加新记录</h3>
              <div className="form-group">
                <label className="form-label">深塔分数</label>
                <input
                  type="number"
                  className="form-input"
                  id="scoreInput"
                  placeholder="例如：2220"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                />
              </div>

              <label className="form-label">选择角色配置 (点击头像更换)</label>
              <div className="char-selector-row">
                {selectedMembers.map((member, index) => (
                  <div
                    key={index}
                    id={`slot-${index}`}
                    className={`char-slot ${member ? "filled" : ""}`}
                    onClick={() => handleSlotClick(index)}
                  >
                    {member ? (
                      <>
                        <img src={member.img} className="slot-avatar" alt={member.name} />
                        <span className="slot-name" style={{ fontSize: "12px" }}>{member.name}</span>
                        <select
                          className="chain-select"
                          id={`chain-${index}`}
                          value={member.chain}
                          onClick={(e) => e.stopPropagation()} // 防止触发 slot click
                          onChange={(e) => handleChainChange(index, Number(e.target.value))}
                        >
                          {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                            <option key={n} value={n}>{n}链</option>
                          ))}
                        </select>
                      </>
                    ) : (
                      <>
                        <div className="placeholder-img slot-avatar" style={{ width: 40, height: 40, borderRadius: '50%', background: '#555' }}>+</div>
                        <span className="slot-name" style={{ fontSize: "12px" }}>选择</span>
                        <select className="chain-select" id={`chain-${index}`} onClick={(e) => e.stopPropagation()} style={{ display: 'none' }}>
                          {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                            <option key={n} value={n}>{n}链</option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="modal-actions">
                <button className="btn btn-cancel" onClick={() => setIsModalOpen(false)}>取消</button>
                <button className="btn btn-confirm" onClick={handleSave}>保存</button>
              </div>

              {/* 内部弹层：角色列表 */}
              {isCharListOpen && (
                <div className="char-list-overlay" id="charListOverlay">
                  <h4 style={{ textAlign: "center", marginBottom: "10px", color: "#fff" }}>选择角色</h4>
                  <div className="char-grid" id="charGrid">
                    {CHARACTERS.map((char) => (
                      <div key={char.id} className="char-item" onClick={() => handleSelectChar(char)}>
                        <img src={char.img} alt={char.name} />
                        <span>{char.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      }
    </main >
  );
}

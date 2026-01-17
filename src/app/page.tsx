/* src/app/page.tsx */
"use client";

import { useState, useEffect, useRef } from "react";

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

// --- Components ---

// 1. 卡片组件
function TeamCard({ team, onDelete, onEdit }: { team: Team; onDelete: (id: number) => void; onEdit: (id: number) => void; }) {
  const [isSliding, setIsSliding] = useState(false);
  const startXRef = useRef(0);
  const [currentX, setCurrentX] = useState(0);

  const MAX_SLIDE_WIDTH = 150;

  const handleTouchStart = (e) => {
    // 记录初始触摸点和当前的偏移量（以防第二次拖拽）
    startXRef.current = e.touches[0].clientX - currentX;
    setIsSliding(true);
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // 防止页面上下滚动干扰
    const touchX = e.touches[0].clientX;
    const deltaX = touchX - startXRef.current;

    // 限制滑动范围：
    // Math.min(0, ...) 确保不能向右滑动超过初始位置（出现空白）
    // Math.max(-MAX_SLIDE_WIDTH, ...) 确保不能向左滑动超过按钮宽度
    const newX = Math.min(0, Math.max(deltaX, -MAX_SLIDE_WIDTH));

    setCurrentX(newX);
  };

  const handleTouchEnd = () => {
    setIsSliding(false);

    // 自动吸附逻辑：
    // 如果滑动超过一半宽度，就完全展开；否则弹回
    if (currentX < -(MAX_SLIDE_WIDTH / 2)) {
      setCurrentX(-MAX_SLIDE_WIDTH); // 展开状态
    } else {
      setCurrentX(0); // 收起状态
    }
  };

  const handleDelete = () => {
    onDelete(team.id);
  };


  return (
    <div className="team-item-wrapper">
      <div
        className={`team-card flex-grow ${isSliding ? 'sliding' : ''}`}
        style={{
          transform: `translateX(${currentX}px)`,
          transition: isSliding ? 'none' : 'transform 0.3s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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
        <div className="card-actions">
          <button className="action-btn edit-btn" onClick={() => onEdit(team.id)}>编辑</button>
          <button className="action-btn delete-btn" onClick={handleDelete}>删除</button>
        </div>
      </div>
    </div>
  );
}

// 2. 主页面
export default function Home() {
  // 状态：队伍列表
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初始化：从localStorage加载数据
  useEffect(() => {
    const savedTeams = localStorage.getItem("teams");
    if (savedTeams) {
      try {
        setTeams(JSON.parse(savedTeams));
      } catch (e) {
        console.error("Failed to parse teams from localStorage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 保存到localStorage
  const saveTeamsToStorage = (updatedTeams: Team[]) => {
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    setTeams(updatedTeams);
  };

  // 状态：弹窗控制
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCharListOpen, setIsCharListOpen] = useState(false);

  // 状态：正在编辑的新队伍数据
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [score, setScore] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<(TeamMember | null)[]>([null, null, null]);
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number | null>(null);

  // 打开主弹窗
  const handleOpenModal = () => {
    setEditingTeamId(null);
    setScore("");
    setSelectedMembers([null, null, null]);
    setIsModalOpen(true);
  };

  // 保存队伍（支持新增与编辑）
  const handleSave = () => {
    if (!score) return alert("请填写分数");
    if (selectedMembers.some((m) => m === null)) return alert("请完整选择3个角色");

    const members = selectedMembers as TeamMember[];

    if (editingTeamId === null) {
      const newTeamCount = teams.length + 1;
      const nameToUse = `队伍${newTeamCount}`;
      const newTeam: Team = {
        id: Date.now(),
        name: nameToUse,
        score,
        members,
      };
      const updatedTeams = [...teams, newTeam];
      saveTeamsToStorage(updatedTeams);
    } else {
      const updatedTeams = teams.map(t => t.id === editingTeamId ? { ...t, score, members } : t);
      saveTeamsToStorage(updatedTeams);
    }

    setIsModalOpen(false);
  };

  // 删除队伍
  const handleDeleteTeam = (id: number) => {
    if (window.confirm("确定要删除这个队伍吗？")) {
      const updatedTeams = teams.filter(team => team.id !== id);
      saveTeamsToStorage(updatedTeams);
    }
  };

  // 编辑队伍：在模态中回显并打开编辑模式
  const handleEditTeam = (id: number) => {
    const team = teams.find(t => t.id === id);
    if (!team) return;

    setEditingTeamId(id);
    setScore(team.score);
    // 保证长度为3
    const members: (TeamMember | null)[] = [null, null, null];
    for (let i = 0; i < Math.min(3, team.members.length); i++) {
      members[i] = team.members[i];
    }
    setSelectedMembers(members);
    setIsModalOpen(true);
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
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <img src="./pic/logo.png" alt="矩阵叠兵" style={{ height: "40px" }} />
        <div style={{ fontSize: "18px", color: "var(--text-gold)", fontWeight: "bold" }}>
          总积分: {teams.reduce((sum, team) => sum + parseInt(team.score || "0"), 0)}
        </div>
      </div>

      <div id="team-list" className="space-y-4">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} onDelete={handleDeleteTeam} onEdit={handleEditTeam} />
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
              <h3>{editingTeamId === null ? '添加新记录' : '编辑记录'}</h3>
              <div className="form-group">
                <label className="form-label">矩阵分数</label>
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
                <button className="btn btn-confirm" onClick={handleSave}>{editingTeamId === null ? '保存' : '更新'}</button>
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
